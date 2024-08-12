// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SwapVert } from "@material-ui/icons";
import { useI18n } from "../../../i18n";
import { PageHeading, PageContent } from "../../../page";
import UsageReport from "./export/component";
import { USAGE_REPORT_DIALOG } from "./export/constants";
import { useDialog } from "../../../action-dialog";

import { FormAction } from "../../../form";

const Container = () => {
  const i18n = useI18n();
  const { setDialog, pending, dialogOpen, setDialogPending, dialogClose } = useDialog(USAGE_REPORT_DIALOG);
  const handleExport = dialog => setDialog({ dialog, open: true });
  const handleClickExport = () => handleExport(USAGE_REPORT_DIALOG);

  return (
    <>
      <PageHeading title={i18n.t("settings.navigation.usage_reports")}>
        <FormAction actionHandler={handleClickExport} text={i18n.t("buttons.export")} startIcon={<SwapVert />} />
      </PageHeading>
      <PageContent>
        <UsageReport
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
