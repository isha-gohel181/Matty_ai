import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getMyDesigns,
  deleteDesign,
  shareDesignWithTeam,
} from "@/redux/slice/design/design.slice";
import { fetchUserTeams } from "@/redux/slice/team/teamSlice";
import { selectUser } from "@/redux/slice/user/user.slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, Share2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DashboardFile = () => {
  const dispatch = useDispatch();
  const { designs, loading } = useSelector((state) => state.design);
  const { teams } = useSelector((state) => state.team);
  const user = useSelector(selectUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    dispatch(getMyDesigns(searchQuery));
    dispatch(fetchUserTeams());
  }, [dispatch, searchQuery]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      dispatch(deleteDesign(id));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleShare = (design) => {
    setSelectedDesign(design);
    setShareDialogOpen(true);
  };

  const handleTeamShare = async () => {
    if (!selectedTeam || !selectedDesign) return;

    try {
      await dispatch(shareDesignWithTeam({ id: selectedDesign._id, teamId: selectedTeam })).unwrap();
      toast.success("Design shared with team successfully!");
      setShareDialogOpen(false);
      setSelectedTeam("");
    } catch (error) {
      toast.error(error.message || "Failed to share design");
    }
  };

  if (loading && designs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Designs</h1>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search designs by title or tags..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 w-full md:max-w-md"
        />
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Share "{selectedDesign?.title}" with a team:</p>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.team._id} value={team.team._id}>
                    {team.team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTeamShare} disabled={!selectedTeam}>
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {designs.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No designs yet!</h2>
          <p className="text-muted-foreground mt-2">
            Click the button below to start creating.
          </p>
          <Button asChild className="mt-6">
            <Link to="/dashboard/editor">Create New Design</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {designs.map((design) => (
            <motion.div
              key={design._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-0">
                  <Link to={`/dashboard/editor/${design._id}`}>
                    <img
                      src={design.thumbnailUrl.secure_url}
                      alt={design.title}
                      className="rounded-t-lg aspect-video object-cover"
                    />
                  </Link>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 gap-2">
                  <span className="font-semibold truncate w-full">{design.title}</span>
                  {design.tags && design.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {design.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end w-full gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(design)}
                      title="Share with team"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(design._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardFile;