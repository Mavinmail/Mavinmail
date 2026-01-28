import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/roleMiddleware.js';
import {
    listUsers,
    getUserById,
    updateUserRole,
    suspendUser,
    activateUser,
    getPlatformStats,
    getAuditLogs,
} from '../controllers/adminController.js';
import {
    getAllTickets,
    getAdminTicketById,
    updateTicket,
    getTicketStats,
} from '../controllers/supportController.js';

const router = Router();

// ============================================================================
// ALL ADMIN ROUTES REQUIRE:
// 1. Authentication (authMiddleware)
// 2. Admin role (requireAdmin) - ADMIN or SUPER_ADMIN
// ============================================================================

// Apply auth middleware to all routes
router.use(authMiddleware);

// ============================================================================
// USER MANAGEMENT ROUTES - Requires ADMIN or SUPER_ADMIN
// ============================================================================

// GET /api/admin/users - List all users (paginated)
router.get('/users', requireAdmin, listUsers);

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', requireAdmin, getUserById);

// PUT /api/admin/users/:id - Update user role
router.put('/users/:id', requireAdmin, updateUserRole);

// POST /api/admin/users/:id/suspend - Suspend user
router.post('/users/:id/suspend', requireAdmin, suspendUser);

// POST /api/admin/users/:id/activate - Activate user
router.post('/users/:id/activate', requireAdmin, activateUser);

// ============================================================================
// PLATFORM STATS ROUTES - Requires ADMIN or SUPER_ADMIN
// ============================================================================

// GET /api/admin/stats - Platform overview statistics
router.get('/stats', requireAdmin, getPlatformStats);

// ============================================================================
// SUPPORT TICKET ROUTES - Requires ADMIN or SUPER_ADMIN
// ============================================================================

// GET /api/admin/support-tickets/stats - Get ticket statistics
router.get('/support-tickets/stats', requireAdmin, getTicketStats);

// GET /api/admin/support-tickets - List all support tickets
router.get('/support-tickets', requireAdmin, getAllTickets);

// GET /api/admin/support-tickets/:id - Get ticket details
router.get('/support-tickets/:id', requireAdmin, getAdminTicketById);

// PUT /api/admin/support-tickets/:id - Update ticket status/priority
router.put('/support-tickets/:id', requireAdmin, updateTicket);

// ============================================================================
// AUDIT LOG ROUTES - Requires SUPER_ADMIN only
// ============================================================================

// GET /api/admin/audit-logs - View audit history
router.get('/audit-logs', requireSuperAdmin, getAuditLogs);

export default router;

