
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Eye } from 'lucide-react';

interface Episode {
  id: string;
  title: string;
  season_number: number;
  episode_number: number;
  air_date?: string;
  is_watched?: boolean;
}

interface ShowTrackerProps {
  showId: string;
  showTitle: string;
  onStatusChange?: () => void;
}

export const ShowTracker: React.FC<ShowTrackerProps> = ({ 
  showId, 
  showTitle,
  onStatusChange 
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEpisodes();
  }, [showId, user]);

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('show_id', showId)
        .order('season_number', { ascending: true })
        .order('episode_number', { ascending: true });

      if (error) throw error;

      let episodesWithStatus = data || [];

      if (user) {
        const episodeIds = episodesWithStatus.map((ep: any) => ep.id);
        if (episodeIds.length > 0) {
          const { data: watchedEpisodes, error: watchError } = await supabase
            .from('user_episode_status')
            .select('episode_id')
            .eq('user_id', user.id)
            .eq('status', 'watched')
            .in('episode_id', episodeIds);

          if (!watchError) {
            const watchedEpisodeIds = new Set(
              watchedEpisodes?.map((ws: any) => ws.episode_id) || []
            );
            episodesWithStatus = episodesWithStatus.map((ws: any) => ({
              ...ws,
              is_watched: watchedEpisodeIds.has(ws.id),
            }));
          }
        }
      }

      setEpisodes(episodesWithStatus);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load episodes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchStatus = async (episodeId: string, currentlyWatched: boolean) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to track episodes',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (currentlyWatched) {
        const { error } = await supabase
          .from('user_episode_status')
          .delete()
          .eq('user_id', user.id)
          .eq('episode_id', episodeId);

        if (error) throw error;

        setEpisodes(prev =>
          prev.map(ep =>
            ep.id === episodeId ? { ...ep, is_watched: false } : ep
          )
        );
        onStatusChange?.();
      } else {
        const { error } = await supabase
          .from('user_episode_status')
          .upsert({
            user_id: user.id,
            episode_id: episodeId,
            status: 'watched',
            watched_at: new Date().toISOString(),
          });

        if (error) throw error;

        setEpisodes(prev =>
          prev.map(ep =>
            ep.id === episodeId ? { ...ep, is_watched: true } : ep
          )
        );
        onStatusChange?.();
      }

      toast({
        title: 'Success',
        description: `Episode marked as ${currentlyWatched ? 'unwatched' : 'watched'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update watch status',
        variant: 'destructive',
      });
    }
  };

  const watchedCount = episodes.filter(ep => ep.is_watched).length;
  const totalCount = episodes.length;
  const progressPercentage = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const groupedEpisodes = episodes.reduce((acc, episode) => {
    const season = episode.season_number;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {} as Record<number, Episode[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{showTitle}</CardTitle>
          <CardDescription>
            {watchedCount} of {totalCount} episodes watched
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            {progressPercentage.toFixed(1)}% complete
          </p>
        </CardContent>
      </Card>

      {Object.entries(groupedEpisodes)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([season, seasonEpisodes]) => {
          const seasonWatched = seasonEpisodes.filter(ep => ep.is_watched).length;
          const seasonTotal = seasonEpisodes.length;
          
          return (
            <Card key={season}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Season {season}
                  <Badge variant="secondary">
                    {seasonWatched}/{seasonTotal}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {seasonWatched} of {seasonTotal} episodes watched
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {seasonEpisodes.map((episode) => (
                    <div
                      key={episode.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        episode.is_watched
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          E{episode.episode_number}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{episode.title}</h4>
                          {episode.air_date && (
                            <p className="text-sm text-gray-500">
                              {new Date(episode.air_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {episode.is_watched && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <Button
                        variant={episode.is_watched ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => toggleWatchStatus(episode.id, episode.is_watched || false)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {episode.is_watched ? 'Watched' : 'Mark Watched'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};
