import {useFormContext} from 'react-hook-form';
import {CreateBackstageRequestPayload} from '@app/web-player/backstage/requests/use-create-backstage-request';
import {useSocialLogin} from '@common/auth/requests/use-social-login';
import {Trans} from '@ui/i18n/trans';
import {Button} from '@ui/buttons/button';
import {TwitterIcon} from '@ui/icons/social/twitter';
import {useUser} from '@common/auth/ui/use-user';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {FacebookIcon} from '@ui/icons/social/facebook';
import {DocumentScannerIcon} from '@ui/icons/material/DocumentScanner';
import {prettyBytes} from '@ui/utils/files/pretty-bytes';
import React, {cloneElement, ReactElement, ReactNode} from 'react';
import {SvgIconProps} from '@ui/icons/svg-icon';
import {IconButton} from '@ui/buttons/icon-button';
import {CloseIcon} from '@ui/icons/material/Close';
import {useActiveUpload} from '@common/uploads/uploader/use-active-upload';
import {queryClient} from '@common/http/query-client';
import {useSettings} from '@ui/settings/use-settings';
import {FileInputType} from '@ui/utils/files/file-input-config';
import {Disk} from '@common/uploads/uploader/backend-metadata';

export function BackstageFormAttachments() {
  const {social} = useSettings();
  const {watch, setValue} = useFormContext<CreateBackstageRequestPayload>();
  const {connectSocial} = useSocialLogin();
  const passportScan = watch('passportScan');

  return (
    <div className="py-20">
      <div className="mb-14 text-sm">
        <Trans message="Speed up the process by connecting artist social media accounts or uploading your passport scan." />
      </div>
      {social?.twitter?.enable && (
        <Button
          variant="outline"
          startIcon={<TwitterIcon className="text-twitter" />}
          className="mb-10 mr-10 md:mb-0"
          onClick={async () => {
            const e = await connectSocial('twitter');
            if (e?.status === 'SUCCESS') {
              queryClient.invalidateQueries({queryKey: ['users']});
              toast(message('Connected twitter account'));
            }
          }}
        >
          <Trans message="Connect to twitter" />
        </Button>
      )}
      {social?.facebook?.enable && (
        <Button
          variant="outline"
          startIcon={<FacebookIcon className="text-facebook" />}
          className="mb-10 mr-10 md:mb-0"
          onClick={async () => {
            const e = await connectSocial('facebook');
            if (e?.status === 'SUCCESS') {
              queryClient.invalidateQueries({queryKey: ['users']});
              toast(message('Connected facebook account'));
            }
          }}
        >
          <Trans message="Connect to facebook" />
        </Button>
      )}
      <PassportScanButton />
      <div className="mt-20">
        {passportScan && (
          <AttachmentLayout
            icon={<DocumentScannerIcon />}
            title={<Trans message="Passport scan" />}
            description={`${passportScan.name} (${prettyBytes(
              passportScan.file_size,
            )})`}
            onRemove={() => {
              setValue('passportScan', undefined);
            }}
          />
        )}
        <SocialServiceAttachment service="twitter" />
        <SocialServiceAttachment service="facebook" />
      </div>
    </div>
  );
}

interface SocialServiceAttachmentProps {
  service: 'twitter' | 'facebook';
}
function SocialServiceAttachment({service}: SocialServiceAttachmentProps) {
  const {disconnectSocial} = useSocialLogin();
  const {data} = useUser('me', {
    with: ['social_profiles'],
  });
  const account = data?.user.social_profiles.find(
    s => s.service_name === service,
  );
  if (!account) return null;

  return (
    <AttachmentLayout
      icon={
        service === 'twitter' ? (
          <TwitterIcon className="text-twitter" />
        ) : (
          <FacebookIcon className="text-facebook" />
        )
      }
      title={
        <span className="capitalize">
          <Trans message=":service account" values={{service}} />
        </span>
      }
      description={account.username}
      isDisabled={disconnectSocial.isPending}
      onRemove={() => {
        disconnectSocial.mutate(
          {service: 'twitter'},
          {
            onSuccess: () => {
              queryClient.invalidateQueries({queryKey: ['users']});
            },
          },
        );
      }}
    />
  );
}

interface AttachmentLayoutProps {
  icon: ReactElement<SvgIconProps>;
  title: ReactNode;
  description: ReactNode;
  onRemove: () => void;
  isDisabled?: boolean;
}
function AttachmentLayout({
  icon,
  title,
  description,
  onRemove,
  isDisabled,
}: AttachmentLayoutProps) {
  return (
    <div className="mb-8 flex items-center gap-8 rounded border px-14 py-8">
      <div className="flex-shrink-0 text-muted">
        {cloneElement(icon, {size: 'lg'})}
      </div>
      <div>
        <div className="text-xs text-muted">{title}</div>
        <div className="text-sm">{description}</div>
      </div>
      <IconButton
        className="ml-auto flex-shrink-0"
        onClick={() => onRemove()}
        disabled={isDisabled}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

const FiveMB = 5 * 1024 * 1024;
function PassportScanButton() {
  const {setValue} = useFormContext<CreateBackstageRequestPayload>();
  const {selectAndUploadFile} = useActiveUpload();

  const handleUpload = () => {
    selectAndUploadFile({
      showToastOnRestrictionFail: true,
      restrictions: {
        allowedFileTypes: [FileInputType.image],
        maxFileSize: FiveMB,
      },
      metadata: {
        disk: Disk.uploads,
      },
      onSuccess: entry => {
        setValue('passportScan', entry);
      },
    });
  };

  return (
    <Button
      variant="outline"
      startIcon={<DocumentScannerIcon className="text-primary" />}
      onClick={() => handleUpload()}
    >
      <Trans message="Upload passport scan" />
    </Button>
  );
}
