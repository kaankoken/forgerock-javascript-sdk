import { it, expect } from '@effect/vitest';
import { CookieService, cookieServiceTest } from '../cookie.service';
import { Effect, Either } from 'effect';
import { Cookies } from '@effect/platform';

beforeEach(() => {
  vi.useFakeTimers();
  const date = new Date(2000, 1, 1, 13);
  vi.setSystemTime(date);
});
afterEach(() => {
  vi.useRealTimers();
});

it.effect('should write cookies', () =>
  Effect.gen(function* () {
    const cookieOptions: Cookies.Cookie['options'] = {
      httpOnly: true,
      expires: new Date(Date.now() + 36000),
      path: '/',
      maxAge: 36000,
      // sameSite: "none" add this in when we need it.
    };
    const { writeCookie } = yield* CookieService;

    const cookie = yield* writeCookie({ cookie: 'stepIndex=2' }, '123456');

    const expected = Cookies.setAll(Cookies.empty, [
      ['interactionId', '123', cookieOptions],
      ['interactionToken', '123456', cookieOptions],
      ['stepIndex', '3', cookieOptions],
    ]);

    expect(cookie).toEqual(Either.getOrNull(expected));
  }).pipe(Effect.provideService(CookieService, cookieServiceTest)),
);