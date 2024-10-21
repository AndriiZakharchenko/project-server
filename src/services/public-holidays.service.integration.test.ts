import { getListOfPublicHolidays, checkIfTodayIsPublicHoliday, getNextPublicHolidays } from './public-holidays.service';

describe('getListOfPublicHolidays', () => {
  test('should return holidays for France', async () => {
    const holidaysResponse = await getListOfPublicHolidays(2024, 'FR');
    expect(holidaysResponse.length).toBeGreaterThan(0);
  });

  test('should return empty array when we get error', async () => {
    const holidaysResponse = await getListOfPublicHolidays(0, 'FR');
    expect(holidaysResponse).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('checkIfTodayIsPublicHoliday', () => {
  test('should return status false if today is not public holiday', async () => {
    const holidaysResponse = await checkIfTodayIsPublicHoliday('FR');
    expect(holidaysResponse).toEqual(false);
  });
});

describe('getNextPublicHolidays', () => {
  test('should return data', async () => {
    const response = await getNextPublicHolidays('FR');

    response.forEach((holiday) => {
      expect(holiday).toEqual({
        date: expect.any(String),
        localName: expect.any(String),
        name: expect.any(String),
      });
    });
  });

  test('should return error when we put incorrect country', async () => {
    await expect(getNextPublicHolidays('FRR')).rejects.toThrow(
      'Country provided is not supported, received: FRR',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
