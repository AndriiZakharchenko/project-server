// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

const NAGER_API = 'https://date.nager.at';

describe('/IsTodayPublicHoliday', () => {
  test('should return 204 if today is not public holiday', async () => {
    const { status, body } = await request(NAGER_API).get('/api/v3/IsTodayPublicHoliday/FR?offset=0');

    expect(status).toEqual(204);
  });

  test('should return 404 if we put incorrect value', async () => {
    const { status, body } = await request(NAGER_API).get('/api/v3/IsTodayPublicHoliday/FRR?offset=0');

    expect(status).toEqual(404);
  });
});

describe('/NextPublicHolidays', () => {
  test('should return 200 and list of public holidays', async () => {
    const { status, body } = await request(NAGER_API).get('/api/v3/NextPublicHolidays/FR');

    expect(status).toEqual(200);

    body.forEach((holiday: never) => {
      expect(holiday).toEqual({
        date: expect.any(String),
        localName: expect.any(String),
        name: expect.any(String),
        countryCode: expect.any(String),
        global: expect.any(Boolean),
        counties: null,
        launchYear: null,
        types: expect.any(Array),
        fixed: expect.any(Boolean),
      });
    });
  });
});
