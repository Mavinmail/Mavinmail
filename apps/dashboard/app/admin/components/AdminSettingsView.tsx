"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Star, Loader2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"
import {
    getAdminModels,
    createAIModel,
    updateAIModel,
    deleteAIModel,
    setDefaultAIModel,
    type AIModel,
} from "@/lib/api"

export function AdminSettingsView() {
    const [models, setModels] = React.useState<AIModel[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState<string | null>(null)

    // Add Model Dialog State
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [newModel, setNewModel] = React.useState({
        modelId: "",
        displayName: "",
        description: "",
        isActive: true,
    })
    const [addLoading, setAddLoading] = React.useState(false)

    // Delete Confirmation State
    const [deleteTarget, setDeleteTarget] = React.useState<AIModel | null>(null)
    const [deleteLoading, setDeleteLoading] = React.useState(false)

    // Fetch models on mount
    const fetchModels = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getAdminModels()
            setModels(data)
        } catch (err: any) {
            setError(err.message || "Failed to load models")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchModels()
    }, [fetchModels])

    // Clear success message after 3 seconds
    React.useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [success])

    // Handle Add Model
    const handleAddModel = async () => {
        if (!newModel.modelId.trim() || !newModel.displayName.trim()) {
            setError("Model ID and Display Name are required")
            return
        }

        setAddLoading(true)
        setError(null)
        try {
            await createAIModel(newModel)
            setSuccess("Model added successfully")
            setIsAddDialogOpen(false)
            setNewModel({ modelId: "", displayName: "", description: "", isActive: true })
            await fetchModels()
        } catch (err: any) {
            setError(err.message || "Failed to add model")
        } finally {
            setAddLoading(false)
        }
    }

    // Handle Toggle Active
    const handleToggleActive = async (model: AIModel) => {
        try {
            await updateAIModel(model.id, { isActive: !model.isActive })
            setModels(prev =>
                prev.map(m => m.id === model.id ? { ...m, isActive: !m.isActive } : m)
            )
            setSuccess(`Model ${model.isActive ? "deactivated" : "activated"} successfully`)
        } catch (err: any) {
            setError(err.message || "Failed to update model")
        }
    }

    // Handle Set Default
    const handleSetDefault = async (model: AIModel) => {
        if (model.isDefault) return

        try {
            await setDefaultAIModel(model.id)
            setModels(prev =>
                prev.map(m => ({ ...m, isDefault: m.id === model.id }))
            )
            setSuccess(`${model.displayName} is now the default model`)
        } catch (err: any) {
            setError(err.message || "Failed to set default model")
        }
    }

    // Handle Delete
    const handleDelete = async () => {
        if (!deleteTarget) return

        setDeleteLoading(true)
        try {
            await deleteAIModel(deleteTarget.id)
            setSuccess("Model deleted successfully")
            setDeleteTarget(null)
            await fetchModels()
        } catch (err: any) {
            setError(err.message || "Failed to delete model")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
                    <p className="text-muted-foreground">Manage AI models and system configuration</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchModels}
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    {success}
                </div>
            )}

            {/* AI Model Management Card */}
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-foreground">AI Models</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Manage available OpenRouter AI models for users
                        </CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Model
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New AI Model</DialogTitle>
                                <DialogDescription>
                                    Add a new OpenRouter free model. Model ID must be valid.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modelId">Model ID *</Label>
                                    <Input
                                        id="modelId"
                                        placeholder="e.g., meta-llama/llama-3.3-70b-instruct:free"
                                        value={newModel.modelId}
                                        onChange={(e) => setNewModel(prev => ({ ...prev, modelId: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        OpenRouter model identifier (with :free suffix for free tier)
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name *</Label>
                                    <Input
                                        id="displayName"
                                        placeholder="e.g., Llama 3.3 70B (Free)"
                                        value={newModel.displayName}
                                        onChange={(e) => setNewModel(prev => ({ ...prev, displayName: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="e.g., Meta's latest open-source model"
                                        value={newModel.description}
                                        onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isActive"
                                        checked={newModel.isActive}
                                        onCheckedChange={(checked) => setNewModel(prev => ({ ...prev, isActive: checked }))}
                                    />
                                    <Label htmlFor="isActive">Active (visible to users)</Label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddModel} disabled={addLoading}>
                                    {addLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Add Model
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : models.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No models configured. Add your first model above.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Model ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {models.map((model) => (
                                    <TableRow key={model.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{model.displayName}</span>
                                                {model.isDefault && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            {model.description && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {model.description}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {model.modelId}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={model.isActive}
                                                onCheckedChange={() => handleToggleActive(model)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!model.isDefault && model.isActive && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSetDefault(model)}
                                                        title="Set as default"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {!model.isDefault && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => setDeleteTarget(model)}
                                                        title="Delete model"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete AI Model</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deleteTarget?.displayName}"?
                            This action cannot be undone. Users who have this model selected will
                            be switched to the default model.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
