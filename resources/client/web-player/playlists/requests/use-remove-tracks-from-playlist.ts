import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Playlist} from '@app/web-player/playlists/playlist';
import {useMutation} from '@tanstack/react-query';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {apiClient, queryClient} from '@common/http/query-client';
import {Track} from '@app/web-player/tracks/track';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Response extends BackendResponse {
  playlist: Playlist;
}

interface Payload {
  playlistId: number;
  tracks: Track[];
}

export function useRemoveTracksFromPlaylist() {
  return useMutation({
    mutationFn: (payload: Payload) => removeTracks(payload),
    onSuccess: (response, {tracks}) => {
      toast(
        message('Removed [one 1 track|other :count tracks] from playlist', {
          values: {count: tracks.length},
        }),
      );
      queryClient.invalidateQueries({
        queryKey: ['playlists', response.playlist.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['tracks', 'playlist', response.playlist.id],
      });
    },
    onError: r => showHttpErrorToast(r),
  });
}

function removeTracks(payload: Payload): Promise<Response> {
  const backendPayload = {
    ids: payload.tracks.map(track => track.id),
  };
  return apiClient
    .post(`playlists/${payload.playlistId}/tracks/remove`, backendPayload)
    .then(r => r.data);
}
