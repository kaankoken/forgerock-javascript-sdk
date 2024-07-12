import { it, expect } from '@effect/vitest';
import { Tokens, mockTokens } from '../tokens.service';
import { Effect, Layer } from 'effect';
import { mockRequest } from '../request.service';
import { tokenResponseBody } from '../../responses/token/token';

it.effect('should return tokens', () =>
  Effect.gen(function* () {
    const { getTokens } = yield* Tokens;
    const result = yield* getTokens({ cookie: 'the cookie' });

    expect(result).toEqual(tokenResponseBody);
  }).pipe(Effect.provide(Layer.provideMerge(mockTokens, mockRequest))),
);

//it.effect('should return error', () =>
//  Effect.gen(function* () {
//    const { getTokens } = yield* Tokens;
//    const result = yield* getTokens({ cookie: 'the cookie' }).pipe(Effect.flip);
//
//    expect(result).toEqual(HttpError.unauthorizedError('error'));
//  }).pipe(Effect.provide(Layer.provideMerge(mockTokens, mockRequest))),
//);
