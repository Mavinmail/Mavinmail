import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import prisma from '../utils/prisma.js';
import { getLatestEmails } from './emailService.js';
// import { generateSummary } from './aiService.js'; // Assuming this exists or similar

const connection = new Redis({
    maxRetriesPerRequest: null,
});

export const taskQueue = new Queue('scheduledTasks', { connection });

// Define interface for Task Data
interface TaskJobData {
    taskId: number;
    userId: number;
    type: string;
    config?: any;
    frequency?: string;
}

const worker = new Worker<TaskJobData>(
    'scheduledTasks',
    async (job: Job<TaskJobData>) => {
        const { taskId, userId, type, config } = job.data;
        console.log(`[Scheduler] Processing task ${taskId} type=${type} for user ${userId}`);

        try {
            if (type === 'morning-briefing') {
                await handleMorningBriefing(userId);
            } else if (type === 'check-reply') {
                await handleCheckReply(userId, config);
            }

            // Update task status for one-time tasks
            if (job.data.frequency === 'once') {
                await prisma.scheduledTask.update({
                    where: { id: taskId },
                    data: { status: 'completed' }
                });
            }

            console.log(`[Scheduler] Task ${taskId} completed successfully`);
        } catch (error) {
            console.error(`[Scheduler] Task ${taskId} failed:`, error);
            throw error;
        }
    },
    { connection }
);

worker.on('completed', (job) => {
    console.log(`[Scheduler] Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`[Scheduler] Job ${job?.id} failed with ${err.message}`);
});

import { summarizeEmailBatch } from './aiService.js';

// ... (existing imports)

async function handleMorningBriefing(userId: number) {
    try {
        // 1. Fetch recent emails
        const emails = await getLatestEmails(userId, 10);

        if (emails.length === 0) {
            console.log(`[MorningBriefing] No emails to summarize for user ${userId}`);
            return;
        }

        console.log(`[MorningBriefing] Generating summary for ${emails.length} emails...`);

        // 2. Prepare for AI
        const emailInputs = emails.map(e => ({
            id: e.id,
            category: 'Primary',
            content: `From: ${e.from}\nSubject: ${e.subject}\nBody: ${e.content.slice(0, 1000)}`
        }));

        // 3. Generate Summary with AI (with fallback)
        let summaryText = "";
        let summaryJsonStr: string | null = null;

        try {
            summaryJsonStr = await summarizeEmailBatch(emailInputs);
        } catch (aiError: any) {
            console.error(`[MorningBriefing] AI summarization failed:`, aiError.message);
        }

        // 4. Format Content
        const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

        if (summaryJsonStr) {
            try {
                const digest = JSON.parse(summaryJsonStr);
                summaryText = `📬 **Morning Briefing** - ${date}\n`;
                summaryText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

                if (digest.sections && Array.isArray(digest.sections)) {
                    let emailNum = 1;
                    digest.sections.forEach((section: any) => {
                        if (section.items && Array.isArray(section.items)) {
                            section.items.forEach((item: any) => {
                                summaryText += `**${emailNum}. ${item.email_title || 'Email'}**\n`;
                                summaryText += `   📤 From: ${item.sender || 'Unknown'}\n`;

                                const intentEmoji = item.intent === 'Urgent' ? '🔴' : item.intent === 'Request' ? '📝' : item.intent === 'Meeting' ? '📅' : 'ℹ️';
                                const sentimentEmoji = item.sentiment === 'Positive' ? '😊' : item.sentiment === 'Negative' ? '😟' : item.sentiment === 'Urgent' ? '⚠️' : '😐';
                                summaryText += `   ${intentEmoji} ${item.intent || 'Informational'} • ${sentimentEmoji} ${item.sentiment || 'Neutral'}\n\n`;

                                summaryText += `   **Summary:**\n`;
                                summaryText += `   ${item.summary || 'No summary available.'}\n\n`;

                                if (item.action_items && item.action_items.length > 0) {
                                    summaryText += `   **Action Items:**\n`;
                                    item.action_items.forEach((action: string) => summaryText += `   • ${action}\n`);
                                    summaryText += `\n`;
                                }

                                if (item.important_details && item.important_details.length > 0) {
                                    summaryText += `   **Key Details:**\n`;
                                    item.important_details.forEach((detail: string) => summaryText += `   • ${detail}\n`);
                                    summaryText += `\n`;
                                }

                                summaryText += `───────────────────────────────\n\n`;
                                emailNum++;
                            });
                        }
                    });
                }
            } catch (pError) {
                console.error("Parse error, using basic fallback");
                summaryText = `📬 **Morning Briefing** - ${date}\n\n`;
                summaryText += emails.map((e, i) => `${i + 1}. **${e.subject}**\n   From: ${e.from}\n`).join('\n');
            }
        } else {
            // AI Failed completely
            summaryText = `📬 **Morning Briefing** - ${date} (AI Offline)\n\n`;
            summaryText += emails.map((e, i) => `${i + 1}. **${e.subject}**\n   From: ${e.from}\n`).join('\n');
        }

        // 5. Store result
        await prisma.usageLog.create({
            data: {
                userId,
                action: 'digest',
                metadata: { summary: summaryText, emailCount: emails.length },
                success: true
            }
        });

        console.log(`[MorningBriefing] Successfully created and stored digest for user ${userId}`);

    } catch (error) {
        console.error(`[MorningBriefing] Critical failure for user ${userId}:`, error);
        try {
            await prisma.usageLog.create({
                data: {
                    userId,
                    action: 'digest',
                    metadata: { error: (error as any).message },
                    success: false
                }
            });
        } catch (dbError) {
            console.error("[MorningBriefing] Failed to log failure to DB", dbError);
        }
    }
}

async function handleCheckReply(userId: number, config: any) {
    // Placeholder for check-reply logic
    // specific threadId check, etc.
    console.log(`[CheckReply] Checking reply for user ${userId} with config`, config);
}

// ============================================================================
// PUBLIC API
// ============================================================================

export const scheduleTask = async (
    userId: number,
    type: string,
    frequency: string, // "daily", "once"
    time: string,      // "08:00" (HH:mm) or ISO for once
    config: any = {}
) => {
    // 1. Save to DB
    const task = await prisma.scheduledTask.create({
        data: {
            userId,
            type,
            frequency,
            time,
            config,
            status: 'active',
        },
    });

    // 2. Schedule in BullMQ
    // Calculate delay or cron pattern
    // Simple version: If "daily", use repeatable job. If "once", use delay.

    const jobId = `task-${task.id}`;
    const jobOptions: any = { jobId };

    if (frequency === 'daily') {
        // "08:00" -> cron "0 8 * * *"
        const [hour, minute] = time.split(':').map(Number);
        jobOptions.repeat = {
            cron: `${minute} ${hour} * * *`
        };
    } else if (frequency === 'once') {
        // Calculate delay
        const targetDate = new Date(time);
        const delay = targetDate.getTime() - Date.now();
        if (delay > 0) jobOptions.delay = delay;
    }

    // Pass frequency in job data so worker knows if it's 'once'
    await taskQueue.add(type, { taskId: task.id, userId, type, config, frequency }, jobOptions);
    console.log(`[Scheduler] Scheduled task ${task.id} (${type})`);

    return task;
};


export const deleteTask = async (taskId: number) => {
    // 1. First fetch task to know its type/frequency for queue cleanup
    let taskInfo: { type: string; frequency: string; time: string } | null = null;
    try {
        const task = await prisma.scheduledTask.findUnique({ where: { id: taskId } });
        if (task) {
            taskInfo = { type: task.type, frequency: task.frequency, time: task.time };
        }
    } catch (e) {
        console.warn('[Scheduler] Could not fetch task info before deletion');
    }

    // 2. Remove from DB
    try {
        await prisma.scheduledTask.delete({ where: { id: taskId } });
        console.log(`[Scheduler] Task ${taskId} deleted from DB`);
    } catch (error: any) {
        if (error.code === 'P2025') {
            console.warn(`[Scheduler] Task ${taskId} already deleted from DB`);
        } else {
            throw error;
        }
    }

    // 3. Remove from Queue (best effort, don't fail if queue removal fails)
    try {
        if (taskInfo && taskInfo.frequency === 'daily') {
            // For repeatable jobs, we need to remove by the repeat key
            const [hour, minute] = taskInfo.time.split(':').map(Number);
            const cronPattern = `${minute} ${hour} * * *`;

            // Remove repeatable by key - BullMQ requires jobId and repeat options
            await taskQueue.removeRepeatableByKey(`${taskInfo.type}:task-${taskId}:::${cronPattern}`);
            console.log(`[Scheduler] Removed repeatable job for task ${taskId}`);
        } else {
            // For one-time delayed jobs
            const jobs = await taskQueue.getJobs(['delayed', 'waiting']);
            const job = jobs.find(j => j.data.taskId === taskId);
            if (job) {
                await job.remove();
                console.log(`[Scheduler] Removed delayed job for task ${taskId}`);
            }
        }
    } catch (queueError: any) {
        // Log but don't throw - DB deletion is the critical part
        console.warn(`[Scheduler] Queue cleanup warning for task ${taskId}:`, queueError.message);
    }
};

export const listTasks = async (userId: number) => {
    return prisma.scheduledTask.findMany({
        where: { userId }
    });
};
