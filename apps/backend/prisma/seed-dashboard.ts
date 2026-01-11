
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create a Test User
    const email = 'demo@mavinmail.com';
    const password = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            preferredModel: 'google/gemini-2.0-flash-exp:free',
        },
    });

    console.log(`✅ User created: ${user.email} (ID: ${user.id})`);

    // 2. Generate Authentication Token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
    });
    console.log(`🔑 Auth Token: ${token}`);

    // 3. Create Connected Account
    await prisma.connectedAccount.upsert({
        where: {
            userId_provider: {
                userId: user.id,
                provider: 'google',
            }
        },
        update: {},
        create: {
            userId: user.id,
            provider: 'google',
            email: 'ronak@mavinmail.com',
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token',
        },
    });
    console.log('✅ Connected Google Account created');

    // 4. clear existing logs for clean state
    await prisma.usageLog.deleteMany({ where: { userId: user.id } });
    await prisma.syncHistory.deleteMany({ where: { userId: user.id } });

    // 5. Create Sync History (for Total Emails metric)
    await prisma.syncHistory.createMany({
        data: [
            { userId: user.id, emailCount: 150, status: 'success', syncedAt: new Date(Date.now() - 86400000 * 2) }, // 2 days ago
            { userId: user.id, emailCount: 45, status: 'success', syncedAt: new Date() }, // Today
        ]
    });

    // 6. Create Usage Logs (for Activity & Trends)
    const days = 7;
    const actions = ['summarize', 'draft', 'enhance', 'rag_query', 'digest'];
    const logs = [];

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Random number of actions per day
        const count = Math.floor(Math.random() * 10) + 5;

        for (let j = 0; j < count; j++) {
            const action = actions[Math.floor(Math.random() * actions.length)];
            logs.push({
                userId: user.id,
                action,
                metadata: { demo: true },
                success: true,
                createdAt: date,
            });
        }
    }

    // Add some specific recent activity
    logs.push(
        {
            userId: user.id,
            action: 'summarize',
            metadata: { subject: 'Project Update' },
            success: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        },
        {
            userId: user.id,
            action: 'draft',
            metadata: { recipient: 'Sarah' },
            success: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        }
    );

    await prisma.usageLog.createMany({ data: logs });
    console.log(`✅ Created ${logs.length} usage logs`);

    console.log('------------------------------------------------');
    console.log('Seed completed successfully!');
    console.log('You can now use the token above to authenticate.');
    console.log('------------------------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
