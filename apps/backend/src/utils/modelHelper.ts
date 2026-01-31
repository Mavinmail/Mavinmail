// Model Resolution Helper
// Centralized logic for resolving the AI model to use for any request

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Resolves the AI model to use for a request.
 * Priority:
 * 1. User's saved preference (if userId provided and user has preferredModel set)
 * 2. System default from AIModel table (isDefault: true)
 * 3. Environment variable DEFAULT_AI_MODEL
 * 4. Environment variable FALLBACK_AI_MODEL
 * 5. Hardcoded final fallback (should never reach here)
 *
 * @param userId - Optional user ID to lookup preference
 * @param headerOverride - Optional header-based override (for testing/preview)
 * @returns The model ID string to use
 */
export async function resolveUserModel(userId?: number, headerOverride?: string): Promise<string> {
    // 1. If header override is provided (for testing/instant preview), use it
    if (headerOverride) {
        console.log(`[ModelHelper] Using header override: ${headerOverride}`);
        return headerOverride;
    }

    // 2. Try to get user's saved preference from DB
    if (userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(userId) },
                select: { preferredModel: true }
            });

            if (user?.preferredModel) {
                console.log(`[ModelHelper] Using user preference: ${user.preferredModel}`);
                return user.preferredModel;
            }
        } catch (error) {
            console.warn('[ModelHelper] Failed to fetch user preference:', error);
        }
    }

    // 3. Try to get system default from AIModel table
    try {
        const defaultModel = await prisma.aIModel.findFirst({
            where: { isDefault: true, isActive: true },
            select: { modelId: true }
        });

        if (defaultModel?.modelId) {
            console.log(`[ModelHelper] Using DB default: ${defaultModel.modelId}`);
            return defaultModel.modelId;
        }
    } catch (error) {
        console.warn('[ModelHelper] Failed to fetch default model from DB:', error);
    }

    // 4. Environment variable defaults
    const envDefault = process.env.DEFAULT_AI_MODEL;
    if (envDefault) {
        console.log(`[ModelHelper] Using env DEFAULT_AI_MODEL: ${envDefault}`);
        return envDefault;
    }

    const envFallback = process.env.FALLBACK_AI_MODEL;
    if (envFallback) {
        console.log(`[ModelHelper] Using env FALLBACK_AI_MODEL: ${envFallback}`);
        return envFallback;
    }

    // 5. Final hardcoded fallback (should never reach here if env is configured)
    console.warn('[ModelHelper] No model configured! Using emergency fallback.');
    return 'google/gemma-3-4b:free';
}

/**
 * Helper to extract userId from request object
 */
export function getUserIdFromRequest(req: any): number | undefined {
    return req.user?.userId ? Number(req.user.userId) : undefined;
}
