import { apply } from "twind";
import { orange } from "twind/colors";

export default {
  plugins: {
    applydark: apply`dark:(bg-gray-900 text-white) bg-white text-gray-800`,
    ["bottom-border"]: apply`border-b border-gray-100 dark:border-gray-800`,
  },
  preflight: {
    body: apply`applydark`,
  },
};
