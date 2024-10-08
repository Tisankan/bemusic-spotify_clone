import React, {Fragment} from 'react';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {FormImageSelector} from '@common/uploads/components/image-selector';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {FormNormalizedModelChipField} from '@common/tags/form-normalized-model-chip-field';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {GENRE_MODEL} from '@app/web-player/genres/genre';
import {useSettings} from '@ui/settings/use-settings';
import {useIsMobileMediaQuery} from '@ui/utils/hooks/is-mobile-media-query';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {ArtistAlbumsTable} from '@app/admin/artist-datatable-page/artist-form/artist-albums-table';
import {Album} from '@app/web-player/albums/album';
import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {TabPanel, TabPanels} from '@ui/tabs/tab-panels';
import {Tabs} from '@ui/tabs/tabs';
import {useFieldArray} from 'react-hook-form';
import {Button} from '@ui/buttons/button';
import {AddIcon} from '@ui/icons/material/Add';
import {CreateArtistPayload} from '@app/admin/artist-datatable-page/requests/use-create-artist';
import {ProfileLinksForm} from '@app/admin/artist-datatable-page/artist-form/profile-links-form';

interface Props {
  albums?: Album[];
  showExternalFields?: boolean;
}
export function CrupdateArtistForm({albums, showExternalFields}: Props) {
  const isMobile = useIsMobileMediaQuery();
  return (
    <FileUploadProvider>
      <div className="gap-24 md:flex">
        <div className="flex-shrink-0">
          <FormImageSelector
            name="image_small"
            diskPrefix="artist_images"
            label={isMobile ? <Trans message="Image" /> : null}
            variant={isMobile ? 'input' : 'square'}
            previewSize={isMobile ? undefined : 'w-full md:w-224 aspect-square'}
            stretchPreview
          />
          {showExternalFields && (
            <FormSwitch name="verified" className="mt-14">
              <Trans message="Verified" />
            </FormSwitch>
          )}
        </div>
        <div className="mt-24 flex-auto md:mt-0">
          <Tabs isLazy>
            <TabList>
              <Tab>
                <Trans message="Details" />
              </Tab>
              <Tab>
                <Trans message="Links" />
              </Tab>
              <Tab>
                <Trans message="Biography" />
              </Tab>
              <Tab>
                <Trans message="Images" />
              </Tab>
            </TabList>
            <TabPanels className="pt-20">
              <TabPanel>
                <DetailsPanel showExternalFields={showExternalFields} />
              </TabPanel>
              <TabPanel>
                <ProfileLinksForm />
              </TabPanel>
              <TabPanel>
                <BiographyPanel />
              </TabPanel>
              <TabPanel>
                <ImagesPanel />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
      <ArtistAlbumsTable albums={albums} />
    </FileUploadProvider>
  );
}

interface DetailsPanelProps {
  showExternalFields?: boolean;
}
function DetailsPanel({showExternalFields}: DetailsPanelProps) {
  const {trans} = useTrans();
  return (
    <Fragment>
      <FormTextField
        name="name"
        label={<Trans message="Name" />}
        className="mb-24"
        required
        autoFocus
        disabled={!showExternalFields}
      />
      <FormNormalizedModelChipField
        label={<Trans message="Genres" />}
        placeholder={trans(message('+Add genre'))}
        model={GENRE_MODEL}
        name="genres"
        allowCustomValue
        className="mb-24"
      />
      {showExternalFields && <SpotifyIdField />}
    </Fragment>
  );
}

function BiographyPanel() {
  return (
    <Fragment>
      <FormTextField
        name="profile.country"
        label={<Trans message="Country" />}
        className="mb-24"
      />
      <FormTextField
        name="profile.city"
        label={<Trans message="City" />}
        className="mb-24"
      />
      <FormTextField
        inputElementType="textarea"
        rows={5}
        name="profile.description"
        label={<Trans message="Description" />}
        className="mb-24"
      />
    </Fragment>
  );
}

function ImagesPanel() {
  const {fields, append, remove} = useFieldArray<CreateArtistPayload>({
    name: 'profile_images',
  });

  return (
    <div>
      <div className="mb-24 flex flex-wrap gap-12">
        {fields.map((field, index) => {
          return (
            <FormImageSelector
              key={field.id}
              name={`profile_images.${index}.url`}
              diskPrefix="artist_images"
              variant="square"
              previewSize="w-160 h-160"
              stretchPreview
              showRemoveButton
              onChange={value => {
                if (!value) {
                  remove(index);
                }
              }}
            />
          );
        })}
      </div>
      <Button
        variant="outline"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          append({url: ''});
        }}
      >
        <Trans message="Add another image" />
      </Button>
    </div>
  );
}

function SpotifyIdField() {
  const {spotify_is_setup} = useSettings();
  if (!spotify_is_setup) {
    return null;
  }
  return (
    <FormTextField
      name="spotify_id"
      label={<Trans message="Spotify ID" />}
      className="mb-24"
      minLength={22}
      maxLength={22}
    />
  );
}
