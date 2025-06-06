
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface Episode {
  id: string;
  title: string;
  season_number: number;
  episode_number: number;
  air_date?: string;
  description?: string;
  is_watched?: boolean;
}

interface EpisodeListProps {
  showId: string;
  showTitle: string;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ showId, showTitle }) => {
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
              watchedEpisodes?.map((we: any) => we.episode_id) || []
            );
            episodesWithStatus = episodesWithStatus.map((ep: any) => ({
              ...ep,
              is_watched: watchedEpisodeIds.has(ep.id),
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading episodes...</div>
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
      <h2 className="text-2xl font-bold">{showTitle} - Episodes</h2>
      
      {Object.entries(groupedEpisodes)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([season, seasonEpisodes]) => (
          <Card key={season}>
            <CardHeader>
              <CardTitle>Season {season}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seasonEpisodes.map((episode) => (
                  <div
                    key={episode.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      episode.is_watched
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          S{episode.season_number}E{episode.episode_number}
                        </Badge>
                        <h3 className="font-medium">{episode.title}</h3>
                        {episode.is_watched && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      {episode.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {episode.description}
                        </p>
                      )}
                      {episode.air_date && (
                        <p className="text-sm text-gray-500 mt-1">
                          Air Date: {new Date(episode.air_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button
                      variant={episode.is_watched ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleWatchStatus(episode.id, episode.is_watched || false)}
                    >
                      {episode.is_watched ? 'Mark Unwatched' : 'Mark Watched'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
