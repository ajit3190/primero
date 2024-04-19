// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.


import {  SwapVert } from "@material-ui/icons";


import { useI18n } from "../../../i18n";
import { PageHeading, PageContent } from "../../../page";
import UserExporter from "../users-list/components/user-exporter";
import { USER_EXPORTER_DIALOG } from "../users-list/components/user-exporter/constants";
import { useDialog } from "../../../action-dialog";

import { FormAction } from "../../../form";

const Container = () => {
  const i18n = useI18n();
  const { setDialog, pending, dialogOpen, setDialogPending, dialogClose } = useDialog(USER_EXPORTER_DIALOG);
  const handleExport = dialog => setDialog({ dialog, open: true });
  const handleClickExport = () => handleExport(USER_EXPORTER_DIALOG);

  return (
    <>
      <PageHeading title="Usage Reports">
      <FormAction actionHandler={handleClickExport} text={i18n.t("buttons.export")} startIcon={<SwapVert />} />
      </PageHeading>
      <PageContent>
       <UserExporter
          i18n={i18n}
          open={dialogOpen}
          pending={pending}
          close={dialogClose}
          setPending={setDialogPending}
        />       
        
      </PageContent>
    </>
  );
};

Container.displayName = "UsageReports";

Container.propTypes = {};

export default Container;
