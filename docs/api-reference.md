# AssoConnect API Reference
Base URL: `https://app.assoconnect.com/api/v1`  
Auth: `X-AUTH-TOKEN: <your_key>` header  
Accept: `application/ld+json`

---

## Contact

### `POST /api/v1/crm/contacts`

Creates a Contact resource.

**Body fields:**

- `type` `['string', 'null']` — 
- `dateOfBirth` `` — 
- `email` `['string', 'null']` — 
- `landlinePhone` `['string', 'null']` — 
- `mobilePhone` `['string', 'null']` — 
- `postalAddress` `` — 
- `customFields` `['object', 'null']` — 
- `relations` `array` — 

---

### `GET /api/v1/crm/contacts/{id}`

Retrieves a Contact resource.

**Path parameters:**

- `id` — Contact identifier

---

### `PUT /api/v1/crm/contacts/{id}`

Replaces the Contact resource.

**Path parameters:**

- `id` — Contact identifier

**Body fields:**

- `dateOfBirth` `` — 
- `email` `['string', 'null']` — 
- `landlinePhone` `['string', 'null']` — 
- `mobilePhone` `['string', 'null']` — 
- `postalAddress` `` — 
- `customFields` `['object', 'null']` — 
- `relations` `array` — 

---

### `DELETE /api/v1/crm/contacts/{id}`

Removes the Contact resource.

**Path parameters:**

- `id` — Contact identifier

---

### `POST /api/v1/crm/contacts/{id}/merge`

Creates a Contact resource.

**Path parameters:**

- `id` — Contact identifier

**Body fields:**

- `secondaryContactIds` `array` — 

---

### `GET /api/v1/organizations/{organizationId}/contacts`

Retrieves the collection of Contact resources.

**Path parameters:**

- `organizationId` — Contact identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination
- `type` — 
- `type[]` — 
- `email` — 
- `relationType` — 
- `membershipDate[on]` — 
- *... 2 more*

---

## Person

### `GET /api/v1/crm/people/{id}`

Retrieves a Person resource.

**Path parameters:**

- `id` — Person identifier

---

### `PUT /api/v1/crm/people/{id}`

Replaces the Person resource.

**Path parameters:**

- `id` — Person identifier

**Body fields:**

- `dateOfBirth` `` — 
- `firstName` `['string', 'null']` — 
- `lastName` `['string', 'null']` — 
- `contactId` `string` — 

---

## Organization

### `GET /api/v1/organizations/{id}`

Retrieves a Organization resource.

**Path parameters:**

- `id` — Organization identifier

---

### `DELETE /api/v1/organizations/{id}`

Removes the Organization resource.

**Path parameters:**

- `id` — Organization identifier

---

### `GET /api/v1/organizations/{organizationId}/groups`

Retrieves the collection of Organization resources.

**Path parameters:**

- `organizationId` — Organization identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination
- `isAdvanced` — 
- `isLegalParent` — 
- `nonprofit.platform` — 
- `name` — 
- `type` — 
- *... 2 more*

---

### `GET /api/v1/organizations/{organizationId}/groups_detailed`

Retrieves the collection of Organization resources.

**Path parameters:**

- `organizationId` — Organization identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination
- `isAdvanced` — 
- `isLegalParent` — 
- `nonprofit.platform` — 
- `name` — 
- `type` — 
- *... 2 more*

---

### `GET /api/v1/platforms/{platformId}/organizations`

Retrieves the collection of Organization resources.

**Path parameters:**

- `platformId` — Organization identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination
- `isAdvanced` — 
- `isLegalParent` — 
- `nonprofit.platform` — 
- `name` — 
- `type` — 
- *... 2 more*

---

### `GET /api/v1/public/organizations/{id}`

Retrieves a Organization resource.

**Path parameters:**

- `id` — Organization identifier

---

## OrganizationAddress

### `POST /api/v1/organization_addresses`

Creates a OrganizationAddress resource.

**Body fields:**

- `street1` `['string', 'null']` — 
- `street2` `['string', 'null']` — 
- `postal` `['string', 'null']` — 
- `city` `['string', 'null']` — 
- `administrativeArea1` `['string', 'null']` — 
- `administrativeArea2` `['string', 'null']` — 
- `country` `['string', 'null']` — 
- `organization` `['string', 'null']` — 

---

### `GET /api/v1/organization_addresses/{id}`

Retrieves a OrganizationAddress resource.

**Path parameters:**

- `id` — OrganizationAddress identifier

---

### `PUT /api/v1/organization_addresses/{id}`

Replaces the OrganizationAddress resource.

**Path parameters:**

- `id` — OrganizationAddress identifier

**Body fields:**

- `street1` `['string', 'null']` — 
- `street2` `['string', 'null']` — 
- `postal` `['string', 'null']` — 
- `city` `['string', 'null']` — 
- `administrativeArea1` `['string', 'null']` — 
- `administrativeArea2` `['string', 'null']` — 
- `country` `['string', 'null']` — 

---

### `GET /api/v1/organizations/{id}/address`

Retrieves the collection of OrganizationAddress resources.

**Path parameters:**

- `id` — OrganizationAddress identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination

---

## CustomField

### `GET /api/v1/crm/custom_fields_schema/{id}`

Retrieves a CustomField resource.

**Path parameters:**

- `id` — CustomField identifier

---

### `GET /api/v1/crm/organizations/{id}/custom_fields_schema`

Retrieves the collection of CustomField resources.

**Path parameters:**

- `id` — CustomField identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination

---

## Nonprofit

### `GET /api/v1/nonprofits/{id}`

Retrieves a Nonprofit resource.

**Path parameters:**

- `id` — Nonprofit identifier

---

### `PUT /api/v1/nonprofits/{id}`

Replaces the Nonprofit resource.

**Path parameters:**

- `id` — Nonprofit identifier

**Body fields:**

- `frenchRna` `['string', 'null']` — 
- `frenchSiren` `['string', 'null']` — 
- `country` `string` — Iso 3166-2 Country Code of the Nonprofit
- `currency` `Currency-Nonprofit.update` — 
- `locale` `string` — Concatenation of language and country
- `timezone` `DateTimeZone-Nonprofit.update` — 
- `name` `string` — Official name in legal documents

---

### `GET /api/v1/nonprofits/{id}/tax_receipt/sample`

Retrieves a Nonprofit resource.

**Path parameters:**

- `id` — Nonprofit identifier

---

### `GET /api/v1/nonprofits/{id}/url`

Retrieves a Nonprofit resource.

**Path parameters:**

- `id` — Nonprofit identifier

---

### `GET /api/v1/organizations/{organizationId}/nonprofit`

Retrieves a Nonprofit resource.

**Path parameters:**

- `organizationId` — Nonprofit identifier

---

### `GET /api/v1/public/organizations/{organizationId}/nonprofit`

Retrieves a Nonprofit resource.

**Path parameters:**

- `organizationId` — Nonprofit identifier

---

## Network

### `GET /api/v1/networks`

Retrieves the collection of Network resources.

**Query parameters:**

- `pagination` — Enable or disable pagination

---

### `GET /api/v1/networks/{id}`

Retrieves a Network resource.

**Path parameters:**

- `id` — Network identifier

---

## Order

### `GET /api/v1/orders/{id}`

Retrieves a Order resource.

**Path parameters:**

- `id` — Order identifier

---

## Payment

### `GET /api/v1/installments/{id}/payments`

Retrieves the collection of Payment resources.

**Path parameters:**

- `id` — Payment identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination

---

### `GET /api/v1/payments/{id}`

Retrieves a Payment resource.

**Path parameters:**

- `id` — Payment identifier

---

## Invoice

### `GET /api/v1/invoices/{id}`

Retrieves a Invoice resource.

**Path parameters:**

- `id` — Invoice identifier

---

### `POST /api/v1/invoices/{id}/export`

Creates a Invoice resource.

**Path parameters:**

- `id` — Invoice identifier

**Body fields:**

- `invoiceItems` `array` — 
- `comment` `['string', 'null']` — 
- `number` `['string', 'null']` — This property is not unique. Indeed, we can have the same $number value for an invoice and a credit note
- `increment` `['integer', 'null']` — 
- `street1` `['string', 'null']` — 
- `street2` `['string', 'null']` — 
- `postal` `['string', 'null']` — 
- `city` `['string', 'null']` — 
- `administrativeArea1` `['string', 'null']` — 
- `administrativeArea2` `['string', 'null']` — 
- *... 28 more*

---

### `GET /api/v1/organizations/{id}/invoices`

Retrieves the collection of Invoice resources.

**Path parameters:**

- `id` — Invoice identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination
- `date[before]` — 
- `date[strictly_before]` — 
- `date[after]` — 
- `date[strictly_after]` — 
- `type` — 
- *... 6 more*

---

## Collect

### `GET /api/v1/collects/{id}`

Retrieves a Collect resource.

**Path parameters:**

- `id` — Collect identifier

---

### `GET /api/v1/organizations/{organizationId}/collects`

Retrieves the collection of Collect resources.

**Path parameters:**

- `organizationId` — Collect identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination
- `name` — 
- `status` — 
- `status[]` — 
- `websitePageId` — 
- `websitePageId[]` — 
- *... 11 more*

---

### `GET /api/v1/public/collects/{id}`

Retrieves a Collect resource.

**Path parameters:**

- `id` — Collect identifier

---

## MembershipCollect

### `GET /api/v1/membership_collects/{id}`

Retrieves a MembershipCollect resource.

**Path parameters:**

- `id` — MembershipCollect identifier

---

## DonationCollect

### `GET /api/v1/donation_collects/{id}`

Retrieves a DonationCollect resource.

**Path parameters:**

- `id` — DonationCollect identifier

---

## EmailCampaign

### `GET /api/v1/communication/email_campaigns/{id}`

Retrieves a EmailCampaign resource.

**Path parameters:**

- `id` — EmailCampaign identifier

---

### `POST /api/v1/communication/email_campaigns/{id}/export`

Creates a EmailCampaign resource.

**Path parameters:**

- `id` — EmailCampaign identifier

**Body fields:**

- `emailType` `['string', 'null']` — 

---

### `POST /api/v1/communication/email_campaigns/{id}/model`

Creates a EmailCampaign resource.

**Path parameters:**

- `id` — EmailCampaign identifier

**Body fields:**

- `sendingSystem` `['string', 'null']` — 
- `externalId` `['string', 'null']` — 
- `organization` `Organization` — 
- `subject` `string` — 
- `status` `string` — 
- `fraudStatus` `['string', 'null']` — 
- `nbUnverifiedEmailsSent` `integer` — 
- `nbTotalEmailsSent` `integer` — 
- `startDateLastBatch` `['string', 'null']` — 
- `scheduledAt` `['string', 'null']` — 
- *... 9 more*

---

### `PUT /api/v1/communication/email_campaigns/{id}/transitions/{transition}`

Replaces the EmailCampaign resource.

**Path parameters:**

- `id` — EmailCampaign identifier

---

### `POST /api/v1/communication/email_campaigns/{id}/unblock`

Creates a EmailCampaign resource.

**Path parameters:**

- `id` — EmailCampaign identifier

**Body fields:**

- `sendingSystem` `['string', 'null']` — 
- `externalId` `['string', 'null']` — 
- `organization` `Organization` — 
- `subject` `string` — 
- `status` `string` — 
- `fraudStatus` `['string', 'null']` — 
- `nbUnverifiedEmailsSent` `integer` — 
- `nbTotalEmailsSent` `integer` — 
- `startDateLastBatch` `['string', 'null']` — 
- `scheduledAt` `['string', 'null']` — 
- *... 9 more*

---

## MediaObject

### `POST /api/v1/media_objects`

Creates a MediaObject resource.

**Body fields:**

- `contentMd5` `['string', 'null']` — 
- `organization` `Organization-MediaObject.write` — 
- `type` `string` — 
- `mimeType` `string` — 

---

### `GET /api/v1/media_objects/{id}`

Retrieves a MediaObject resource.

**Path parameters:**

- `id` — MediaObject identifier

---

## OrganizationApiKey

### `GET /api/v1/organizations/{id}/api_keys`

Retrieves the collection of OrganizationApiKey resources.

**Path parameters:**

- `id` — OrganizationApiKey identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination

---

### `POST /api/v1/organizations/{id}/api_keys`

Creates a OrganizationApiKey resource.

**Path parameters:**

- `id` — OrganizationApiKey identifier

**Body fields:**

- `email` `['string', 'null']` — 

---

### `GET /api/v1/organizations/{organizationId}/api_keys/{id}`

Retrieves a OrganizationApiKey resource.

**Path parameters:**

- `organizationId` — OrganizationApiKey identifier
- `id` — OrganizationApiKey identifier

---

### `DELETE /api/v1/organizations/{organizationId}/api_keys/{id}`

Removes the OrganizationApiKey resource.

**Path parameters:**

- `organizationId` — OrganizationApiKey identifier
- `id` — OrganizationApiKey identifier

---

## BankAccount

### `POST /api/v1/bank_accounts`

Creates a BankAccount resource.

**Body fields:**

- `owner` `` — 
- `ledgerNumber` `integer` — For the API, calculated in BankAccountNormalizer and will be written by the persister
- `name` `string` — 
- `bankName` `['string', 'null']` — 
- `ownerName` `['string', 'null']` — Necessary for psp
- `shareWithEntireNetwork` `boolean` — 
- `type` `string` — 

---

### `GET /api/v1/bank_accounts/{id}`

Retrieves a BankAccount resource.

**Path parameters:**

- `id` — BankAccount identifier

---

### `PUT /api/v1/bank_accounts/{id}`

Replaces the BankAccount resource.

**Path parameters:**

- `id` — BankAccount identifier

**Body fields:**

- `name` `string` — 
- `bankName` `['string', 'null']` — 
- `shareWithEntireNetwork` `boolean` — 

---

### `DELETE /api/v1/bank_accounts/{id}`

Removes the BankAccount resource.

**Path parameters:**

- `id` — BankAccount identifier

---

### `POST /api/v1/bank_accounts/{id}/unshare`

Creates a BankAccount resource.

**Path parameters:**

- `id` — BankAccount identifier

---

### `GET /api/v1/organizations/{organizationId}/bank_accounts`

Retrieves the collection of BankAccount resources.

**Path parameters:**

- `organizationId` — BankAccount identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination

---

## Entry

### `GET /api/v1/accounting_entries/{id}`

Retrieves a Entry resource.

**Path parameters:**

- `id` — Entry identifier

---

### `GET /api/v1/organizations/{organization}/accounting_entries`

Retrieves the collection of Entry resources.

**Path parameters:**

- `organization` — Entry identifier

**Query parameters:**

- `page` — The collection page number
- `itemsPerPage` — The number of items per page
- `pagination` — Enable or disable pagination
- `account[]` — Entry account
- `amount[gt]` — Entry amount
- `amount[lt]` — Entry amount
- `amount[gte]` — Entry amount
- `amount[lte]` — Entry amount
- *... 62 more*

---

