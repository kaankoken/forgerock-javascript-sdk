import { Schema } from '@effect/schema';
import { Array, Effect, Option, pipe } from 'effect';

import { UnableToFindNextStep } from '../../errors';
import { PingOneCustomHtmlRequestBody } from '../../schemas/custom-html-template/custom-html-template-request.schema';
import { ResponseMapKeys, responseMap } from '../../responses';

import { CustomHtmlRequestBody, QueryTypes } from '../../types';
import { validator } from '../../helpers/match';

type DavinciFormData = Schema.Schema.Type<
  typeof PingOneCustomHtmlRequestBody
>['parameters']['data'];

/**
 * Given data in the shape of Ping's Request formData.value
 * We will dive into the object by accessing `formData`
 * And then `value` off the object.
 *
 */
const mapDataToValue = (data: Option.Option<DavinciFormData>) =>
  pipe(
    data,
    Option.map((data) => data.formData),
    Option.map((data) => data.value),
  );

const getArrayFromResponseMap = (query: QueryTypes) =>
  Effect.succeed(responseMap[query?.acr_values as ResponseMapKeys]);
/**
 * A helper function that will use `acr_values` from query object
 * to grab the array from the `responseMap`.
 */
const getNextStep = (bool: boolean, query: QueryTypes) =>
  Effect.if(bool, {
    onTrue: () => getArrayFromResponseMap(query),
    onFalse: () => Effect.fail(new UnableToFindNextStep()),
  });

/**
 * Get the first element in the responseMap
 */
const getFirstElement = (arr: (typeof responseMap)[ResponseMapKeys]) =>
  Effect.succeed(pipe(Array.headNonEmpty(arr)));

/**
 * Gets the first element from the responseMap
 * And then creates a basic HttpResponse object that
 * will succeed
 *
 */
const getFirstElementAndRespond = (query: QueryTypes) =>
  pipe(
    Option.fromNullable(query?.acr_values),
    Option.map((acr) => responseMap[acr as ResponseMapKeys]),
    Effect.flatMap(getFirstElement),
    Effect.map((body) => ({
      status: 200 as const,
      body,
    })),
  );

/**
 * helper function that dives into a request body for CustomHtmlRequestBody
 * and will apply a validator function to ensure the request passes validation
 */
const validateCustomHtmlRequest = <Body extends CustomHtmlRequestBody>(body: Body) =>
  pipe(
    body,
    Option.fromNullable,
    Option.map((body) => body.parameters),
    Option.map((body) => body.data),
    Option.map((data) => data.formData),
    Option.map((data) => data.value),
    Effect.flatMap(validator),
  );

export {
  getNextStep,
  getFirstElementAndRespond,
  getArrayFromResponseMap,
  mapDataToValue,
  validateCustomHtmlRequest,
};
