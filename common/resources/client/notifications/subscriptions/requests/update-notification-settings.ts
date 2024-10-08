import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {message} from '@ui/i18n/message';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Response extends BackendResponse {
  //
}

type UpdateNotificationSettingsPayload = {
  notif_id: string;
  channels: Record<string, boolean>;
}[];

function UpdateNotificationSettings(
  payload: UpdateNotificationSettingsPayload,
): Promise<Response> {
  return apiClient
    .put('notifications/me/subscriptions', {selections: payload})
    .then(r => r.data);
}

export function useUpdateNotificationSettings() {
  return useMutation({
    mutationFn: (payload: UpdateNotificationSettingsPayload) =>
      UpdateNotificationSettings(payload),
    onSuccess: () => {
      toast(message('Updated preferences'));
      queryClient.invalidateQueries({queryKey: ['notification-subscriptions']});
    },
    onError: err => showHttpErrorToast(err),
  });
}
