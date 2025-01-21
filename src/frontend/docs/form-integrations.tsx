import { useLingui } from "@lingui/react";

import { ErrorAlert, InfoAlert } from "@/components/app/alert";
import { RenderCode } from "@/components/app/render-code";
import { useDomainMessages } from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { INTEGRATIONS_GROUP_CONFIG } from "@/shared/config-bag/integrations";

import { DocumentationRoot } from "./_base";

export function FormIntegrationsDocumentation() {
  const { _ } = useLingui();
  const domainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FORM_ACTIONS
  );
  return (
    <DocumentationRoot>
      <p>
        With integrations, after creating, updating, or deleting data you can
        trigger notifications through email, Slack, or SMS or send data to
        another server for further processing through HTTP.
      </p>
      <p>
        The first step is the activation of the integration i.e. Slack, Twilio,
        SMTP, etc, except for HTTP which is always activated. Activating an
        integration is just you providing the credentials needed to run the
        integration.
      </p>
      <InfoAlert message="All the activation credentials are encrypted at rest." />

      <p>
        The next step is to create a <code>Form Action</code> which is basically
        you trigger an integration&apos;s action to an event like create, update
        or delete.
      </p>
      <p>These are the steps to create a form action;</p>
      <ol>
        <li>
          {" "}
          Click on the <code>{_(domainMessages.TEXT_LANG.CREATE)}</code> button.
        </li>
        <li>
          Select the <code>Trigger</code> i.e. the event on the data you want to
          start this action.
        </li>
        <li>
          Select the <code>Entity</code> or <code>Integration</code> (It is one
          or the other and depends on where you are triggering this form from)
          you want to bind to this action.
        </li>
        <li>
          Select the <code>Action</code> you want to take; The selections on
          this dropdown are a list of the possible things you can do with the
          selected integration.
        </li>
        <li>
          Depending on the action selected above, You will see new fields which
          collect the needed information needed to run the action. Kindly fill
          these fields appropriately.
        </li>
      </ol>
      <p>
        In these generated fields you will be able to use Handlebars and access
        the following
        <ol>
          <li>
            Secrets -{" "}
            <code>
              {`{{`} {INTEGRATIONS_GROUP_CONFIG.credentials.prefix}.ENTRY {`}}`}
            </code>
          </li>
          <li>
            Constants -{" "}
            <code>
              {`{{`} {INTEGRATIONS_GROUP_CONFIG.constants.prefix}.ENTRY {`}}`}
            </code>
          </li>
          <li>
            Current Data -{" "}
            <code>
              {"{{"} data.field {"}}"}
            </code>
          </li>
          <li>
            Current User -
            <code>
              {" "}
              {"{{"} auth.field {"}}"}{" "}
            </code>
          </li>
        </ol>
        <p>
          Since the generated fields take in Handlebars template, you are
          powered to do anything. Below are examples of how you can fill them in
        </p>
        <RenderCode
          input={`// For a URL input, These are valid inputs
{{ ${INTEGRATIONS_GROUP_CONFIG.constants.prefix}.CUSTOM_INTEGRATION_ENDPOINT }}
{{ ${INTEGRATIONS_GROUP_CONFIG.constants.prefix}.SOME_BASE_URL }}/some-endpoint?username={{ auth.username }}

// For a message title, you can mix and match to your satisfaction
Hi {{ data.username }}!
Your Request Has Been {{ data.status }}
Update From {{ ${INTEGRATIONS_GROUP_CONFIG.constants.prefix}.DEFAULT_SUPPORT_NAME }}

// For HTTP headers, you can do
{
  "X-AccessID": "{{ ${INTEGRATIONS_GROUP_CONFIG.constants.prefix}.SOME_INTEGRATION_ID }}",
  "Authorisation": "Bearer {{ ${INTEGRATIONS_GROUP_CONFIG.credentials.prefix}.SOME_INTEGRATION_ACCESS_TOKEN }}"
}

// For text body, you can do
Hi!
{{ ${INTEGRATIONS_GROUP_CONFIG.constants.prefix}.COMPANY_NAME }} has approved your request for
the loan of amount {{ data.amount }}.

Kind Regards!
{{ auth.fullName }}`}
        />
      </p>
      <p>
        As you can see, since it is Handlebars, You can basically mix and match
        the four prefixes anyhow you see fit.
      </p>

      <ErrorAlert message="Deactivating an integration will delete its credentials and remove all its actions." />
    </DocumentationRoot>
  );
}
