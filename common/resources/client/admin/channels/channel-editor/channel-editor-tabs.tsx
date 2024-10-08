import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {Trans} from '@ui/i18n/trans';
import {TabPanel, TabPanels} from '@ui/tabs/tab-panels';
import {Tabs} from '@ui/tabs/tabs';
import React, {Fragment, ReactNode} from 'react';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';

interface Props {
  children: ReactNode;
}
export function ChannelEditorTabs({children}: Props) {
  return (
    <Tabs isLazy>
      <TabList>
        <Tab>
          <Trans message="Details" />
        </Tab>
        <Tab>
          <Trans message="SEO" />
        </Tab>
      </TabList>
      <TabPanels className="pt-20">
        <TabPanel>{children}</TabPanel>
        <TabPanel>
          <SeoFields />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function SeoFields() {
  return (
    <Fragment>
      <FormTextField
        name="config.seoTitle"
        label={<Trans message="SEO title" />}
        className="mb-24"
      />
      <FormTextField
        name="config.seoDescription"
        label={<Trans message="SEO description" />}
        inputElementType="textarea"
        rows={6}
      />
    </Fragment>
  );
}
