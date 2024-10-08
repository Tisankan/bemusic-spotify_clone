import {MouseEvent, useCallback} from 'react';
import {useAuth} from '@common/auth/use-auth';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';

export function useAuthClickCapture() {
  const dialogContext = useDialogContext();
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();

  return useCallback(
    (e: MouseEvent) => {
      if (!isLoggedIn) {
        e.preventDefault();
        e.stopPropagation();

        if (dialogContext) {
          dialogContext.close();
        }

        navigate('/login');
      }
    },
    [navigate, isLoggedIn, dialogContext],
  );
}
