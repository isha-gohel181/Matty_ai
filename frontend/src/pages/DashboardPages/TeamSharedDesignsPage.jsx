import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getTeamSharedDesigns } from "@/redux/slice/design/design.slice";
import { fetchUserTeams } from "@/redux/slice/team/teamSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const TeamSharedDesignsPage = () => {
  const dispatch = useDispatch();
  const { teamId } = useParams();
  const { designs, loading } = useSelector((state) => state.design);
  const { teams } = useSelector((state) => state.team);

  const teamData = teams?.find((t) => t.team._id === teamId);

  useEffect(() => {
    if (teamId) {
      dispatch(getTeamSharedDesigns(teamId));
    }
    dispatch(fetchUserTeams());
  }, [dispatch, teamId]);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard/teams">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {teamData?.team.name || "Team"} - Shared Designs
            </h1>
            <p className="text-muted-foreground">
              {designs.length} design{designs.length !== 1 ? "s" : ""} shared with this team
            </p>
          </div>
        </div>
      </div>

      {/* Shared Designs Grid */}
      {designs.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold">No shared designs yet</h2>
          <p className="text-muted-foreground mt-2">
            Designs shared with this team will appear here.
          </p>
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
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Link to={`/dashboard/editor/${design._id}`}>
                    <img
                      src={design.thumbnailUrl?.secure_url || "/placeholder.png"}
                      alt={design.title}
                      className="rounded-t-lg aspect-video object-cover hover:brightness-90 transition-all cursor-pointer"
                    />
                  </Link>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 gap-3">
                  <div className="w-full">
                    <Link to={`/dashboard/editor/${design._id}`}>
                      <h3 className="font-semibold truncate hover:text-blue-600 cursor-pointer">
                        {design.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      Shared by {design.user?.fullName || "Unknown"}
                    </p>
                  </div>
                  {design.tags && design.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 w-full">
                      {design.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {design.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{design.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <Button asChild className="w-full" size="sm">
                    <Link to={`/dashboard/editor/${design._id}`}>Open Design</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSharedDesignsPage;
