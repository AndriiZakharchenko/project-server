import axios from 'axios';
import { getListOfPublicHolidays, checkIfTodayIsPublicHoliday, getNextPublicHolidays } from './public-holidays.service';

const holidays = [
  {
    name: "New Year's Day",
    localName: "Jour de l'an",
    date: '2024-01-01',
    countryCode: 'FR',
    fixed: true,
    global: true,
    counties: null,
    launchYear: null,
  },
  {
    name: 'Easter Monday',
    localName: 'Lundi de Pâques',
    date: '2024-04-01',
    countryCode: 'FR',
    fixed: true,
    global: true,
    counties: null,
    launchYear: null,
  },
];

describe('getListOfPublicHolidays', () => {
  test('should return holidays for France', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: holidays }));

    const holidaysResponse = await getListOfPublicHolidays(2024, 'FR');
    expect(holidaysResponse).toEqual([
      {
        name: "New Year's Day",
        localName: "Jour de l'an",
        date: '2024-01-01',
      },
      {
        name: 'Easter Monday',
        localName: 'Lundi de Pâques',
        date: '2024-04-01',
      },
    ]);
  });

  test('should return empty array when we get error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('Request failed')));

    const holidaysResponse = await getListOfPublicHolidays(2024, 'FR');
    expect(holidaysResponse).toEqual([]);
  });

  afterEach(() => {
    // clear all mocks to make sure that they won't be passed to any tests out of this file
    jest.clearAllMocks();
  });
});

describe('checkIfTodayIsPublicHoliday', () => {
  test('should return status 200', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ status: 200, data: false }));

    const holidaysResponse = await checkIfTodayIsPublicHoliday('FR');
    expect(holidaysResponse).toEqual(true);
  });

  test('should return false when we get error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('Request failed')));

    const holidaysResponse = await checkIfTodayIsPublicHoliday('FR');
    expect(holidaysResponse).toEqual(false);
  });

  afterEach(() => {
    // clear all mocks to make sure that they won't be passed to any tests out of this file
    jest.clearAllMocks();
  });
});

describe('getNextPublicHolidays', () => {
  test('should return data', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: holidays }));

    const holidaysResponse = await getNextPublicHolidays('FR');
    expect(holidaysResponse).toEqual([
      {
        name: "New Year's Day",
        localName: "Jour de l'an",
        date: '2024-01-01',
      },
      {
        name: 'Easter Monday',
        localName: 'Lundi de Pâques',
        date: '2024-04-01',
      },
    ]);
  });

  test('should return empty array when we get error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('Request failed')));

    const holidaysResponse = await getNextPublicHolidays('FR');
    expect(holidaysResponse).toEqual([]);
  });

  afterEach(() => {
    // clear all mocks to make sure that they won't be passed to any tests out of this file
    jest.clearAllMocks();
  });
});
