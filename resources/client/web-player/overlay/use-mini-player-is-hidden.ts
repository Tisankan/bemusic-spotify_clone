import {useSettings} from '@ui/settings/use-settings';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {useIsMobileMediaQuery} from '@ui/utils/hooks/is-mobile-media-query';

export function useMiniPlayerIsHidden() {
  const {player} = useSettings();
  const mediaIsCued = usePlayerStore(s => s.cuedMedia != null);
  const isAudioProvider = usePlayerStore(s => s.providerName === 'htmlAudio');
  const isMobile = useIsMobileMediaQuery();
  return player?.hide_video || !mediaIsCued || isMobile || isAudioProvider;
}
