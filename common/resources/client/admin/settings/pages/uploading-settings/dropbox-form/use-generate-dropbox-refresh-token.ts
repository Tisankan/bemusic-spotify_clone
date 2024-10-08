import {useMutation} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/http/show-http-error-toast';

interface Response extends BackendResponse {
  refreshToken: string;
}

interface Payload {
  app_key: string;
  app_secret: string;
  access_code: string;
}

export function useGenerateDropboxRefreshToken() {
  return useMutation({
    mutationFn: (props: Payload) => generateToken(props),
    onError: err => showHttpErrorToast(err),
  });
}

function generateToken(payload: Payload): Promise<Response> {
  return apiClient
    .post('settings/uploading/dropbox-refresh-token', payload)
    .then(r => r.data);
}
