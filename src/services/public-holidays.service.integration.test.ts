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
    const holidaysResponse = await getNextPublicHolidays('FR');
    expect(holidaysResponse).toEqual([
      {
        date: '2024-11-01',
        localName: 'Toussaint',
        name: "All Saints' Day",
      },
      {
        date: '2024-11-11',
        localName: 'Armistice 1918',
        name: 'Armistice Day',
      },
      {
        date: '2024-12-25',
        localName: 'Noël',
        name: 'Christmas Day',
      },
      {
        date: '2025-01-01',
        localName: "Jour de l'an",
        name: "New Year's Day",
      },
      {
        date: '2025-04-21',
        localName: 'Lundi de Pâques',
        name: 'Easter Monday',
      },
      {
        date: '2025-05-01',
        localName: 'Fête du Travail',
        name: 'Labour Day',
      },
      {
        date: '2025-05-08',
        localName: 'Victoire 1945',
        name: 'Victory in Europe Day',
      },
      {
        date: '2025-05-29',
        localName: 'Ascension',
        name: 'Ascension Day',
      },
      {
        date: '2025-06-09',
        localName: 'Lundi de Pentecôte',
        name: 'Whit Monday',
      },
      {
        date: '2025-07-14',
        localName: 'Fête nationale',
        name: 'Bastille Day',
      },
      {
        date: '2025-08-15',
        localName: 'Assomption',
        name: 'Assumption Day',
      },
    ]);
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
