"use client"

/**
 * @fileoverview Microsoft Teams Team Management Content Component
 * @module TeamManagementContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Comprehensive Microsoft Teams team management component:
 * - Microsoft Graph Teams API integration
 * - Team member management and roles
 * - Channel management and organization
 * - Team settings and permissions
 * - Project team coordination
 */

import React, { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Settings,
  Mail,
  Crown,
  UserCheck,
  Hash,
  Globe,
  Lock,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  AlertCircle,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { structuredLogger } from "@/lib/structured-logger"

// Import hooks and types
import { useTeamMembers, useTeamChannels } from "@/hooks/useTeamsIntegration"
import type { Team, TeamMember, Channel } from "@/lib/msgraph"

interface TeamManagementContentProps {
  selectedTeam: Team | null
  currentUser: any
  className?: string
}

// Member role configuration
const ROLE_CONFIG = {
  owner: { label: "Owner", icon: Crown, color: "text-yellow-600", bg: "bg-yellow-100" },
  member: { label: "Member", icon: UserCheck, color: "text-blue-600", bg: "bg-blue-100" },
  guest: { label: "Guest", icon: Users, color: "text-gray-600", bg: "bg-gray-100" },
}

// Channel type configuration
const CHANNEL_TYPES = {
  standard: { label: "Standard", icon: Hash, color: "text-blue-600" },
  private: { label: "Private", icon: Lock, color: "text-red-600" },
  shared: { label: "Shared", icon: Globe, color: "text-green-600" },
}

// Member Card Component
const MemberCard: React.FC<{
  member: TeamMember
  isCurrentUser: boolean
  onEditRole: (memberId: string, newRole: string) => void
  onRemoveMember: (memberId: string) => void
}> = ({ member, isCurrentUser, onEditRole, onRemoveMember }) => {
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [newRole, setNewRole] = useState(member.roles[0] || "member")

  const primaryRole = member.roles[0] || "member"
  const roleConfig = ROLE_CONFIG[primaryRole as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.member
  const RoleIcon = roleConfig.icon

  const handleRoleUpdate = () => {
    if (newRole !== primaryRole) {
      onEditRole(member.id, newRole)
    }
    setIsEditingRole(false)
  }

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://graph.microsoft.com/v1.0/users/${member.userId}/photo/$value`} />
            <AvatarFallback>
              {member.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{member.displayName}</h3>
              {isCurrentUser && (
                <Badge variant="outline" className="text-xs">
                  You
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-xs", roleConfig.color, roleConfig.bg)}>
                <RoleIcon className="h-3 w-3 mr-1" />
                {roleConfig.label}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => window.open(`mailto:${member.email}`, "_blank")}>
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingRole(true)} disabled={isCurrentUser}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onRemoveMember(member.id)} disabled={isCurrentUser}>
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Role Edit Dialog */}
        {isEditingRole && (
          <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Member Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Member: {member.displayName}</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRoleUpdate}>Update Role</Button>
                  <Button variant="outline" onClick={() => setIsEditingRole(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}

// Channel Card Component
const ChannelCard: React.FC<{
  channel: Channel
  onEdit: (channel: Channel) => void
  onDelete: (channelId: string) => void
}> = ({ channel, onEdit, onDelete }) => {
  const typeConfig = CHANNEL_TYPES[channel.membershipType as keyof typeof CHANNEL_TYPES] || CHANNEL_TYPES.standard
  const TypeIcon = typeConfig.icon

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TypeIcon className={cn("h-5 w-5", typeConfig.color)} />
            <div>
              <h3 className="font-semibold text-sm">{channel.displayName}</h3>
              {channel.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {typeConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Created {format(new Date(channel.createdDateTime), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => window.open(channel.webUrl, "_blank")}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(channel)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(channel.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Team Overview Component
const TeamOverview: React.FC<{
  team: Team
  memberCount: number
  channelCount: number
}> = ({ team, memberCount, channelCount }) => {
  const copyTeamId = () => {
    navigator.clipboard.writeText(team.id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Team Name</Label>
            <p className="text-sm">{team.displayName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Visibility</Label>
            <div className="flex items-center gap-2">
              {team.visibility === "private" ? (
                <>
                  <Lock className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Private</span>
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Public</span>
                </>
              )}
            </div>
          </div>
        </div>

        {team.description && (
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="text-sm text-muted-foreground">{team.description}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{memberCount}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{channelCount}</div>
              <div className="text-xs text-muted-foreground">Channels</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">Active</div>
              <div className="text-xs text-muted-foreground">Status</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Team ID:</Label>
          <code className="text-xs bg-muted px-2 py-1 rounded flex-1">{team.id}</code>
          <Button variant="ghost" size="sm" onClick={copyTeamId}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(team.webUrl, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Teams
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Team Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Component
const TeamManagementContent: React.FC<TeamManagementContentProps> = ({ selectedTeam, currentUser, className }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  const {
    members,
    loading: membersLoading,
    error: membersError,
    refresh: refreshMembers,
  } = useTeamMembers(selectedTeam?.id || null)

  const {
    channels,
    loading: channelsLoading,
    error: channelsError,
    refresh: refreshChannels,
  } = useTeamChannels(selectedTeam?.id || null)

  // Filter members
  const filteredMembers = useMemo(() => {
    let filtered = members

    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter((member) => member.roles.includes(roleFilter))
    }

    return filtered
  }, [members, searchTerm, roleFilter])

  const handleEditMemberRole = useCallback(
    (memberId: string, newRole: string) => {
      // TODO: Implement role update via Graph API
      structuredLogger.info("Update member role", {
        component: "TeamManagementContent",
        function: "handleEditMemberRole",
        memberId,
        newRole,
        teamId: selectedTeam?.id,
      })
    },
    [selectedTeam?.id]
  )

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      // TODO: Implement member removal via Graph API
      structuredLogger.info("Remove member", {
        component: "TeamManagementContent",
        function: "handleRemoveMember",
        memberId,
        teamId: selectedTeam?.id,
      })
    },
    [selectedTeam?.id]
  )

  const handleEditChannel = useCallback(
    (channel: Channel) => {
      // TODO: Implement channel editing
      structuredLogger.info("Edit channel", {
        component: "TeamManagementContent",
        function: "handleEditChannel",
        channelId: channel.id,
        channelName: channel.displayName,
        teamId: selectedTeam?.id,
      })
    },
    [selectedTeam?.id]
  )

  const handleDeleteChannel = useCallback(
    (channelId: string) => {
      // TODO: Implement channel deletion
      structuredLogger.info("Delete channel", {
        component: "TeamManagementContent",
        function: "handleDeleteChannel",
        channelId,
        teamId: selectedTeam?.id,
      })
    },
    [selectedTeam?.id]
  )

  const isLoading = membersLoading || channelsLoading
  const error = membersError || channelsError

  if (!selectedTeam) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <div className="text-center space-y-2">
          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No team selected</p>
          <p className="text-sm text-muted-foreground">Select a team to manage members and channels</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage team members, channels, and settings for {selectedTeam.displayName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refreshMembers?.()
              refreshChannels?.()
            }}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          <TabsTrigger value="channels">Channels ({channels.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <TeamOverview team={selectedTeam} memberCount={members.length} channelCount={channels.length} />
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          {/* Member Controls */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                  <SelectItem key={role} value={role}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Members List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading team members...</span>
              </div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No members found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isCurrentUser={member.userId === currentUser?.id}
                  onEditRole={handleEditMemberRole}
                  onRemoveMember={handleRemoveMember}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          {/* Channel Controls */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Team Channels</h4>
              <p className="text-sm text-muted-foreground">Manage channels and their settings</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Channel
            </Button>
          </div>

          {/* Channels List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading channels...</span>
              </div>
            </div>
          ) : channels.length === 0 ? (
            <div className="text-center py-8">
              <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No channels found</p>
              <p className="text-sm text-muted-foreground">Create your first channel to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {channels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onEdit={handleEditChannel}
                  onDelete={handleDeleteChannel}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TeamManagementContent
