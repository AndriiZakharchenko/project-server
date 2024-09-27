import { validateInput, shortenPublicHoliday } from "./helpers";

describe('validateInput', () => {
  test('should return true if year and country are valid', () => {
    expect(validateInput({year: 2024, country: 'FR'})).toEqual(true);
  });

  test('should throw error if provided country is not supported', () => {
    expect(() => validateInput({year: 2024, country: 'France'})).toThrow(
      new Error('Country provided is not supported, received: France')
    );
  });

  test('should throw error if provided year is not the current year', () => {
    expect(() => validateInput({year: 2023, country: 'FR'})).toThrow(
      new Error('Year provided not the current, received: 2023')
    );
  });
});

describe('shortenPublicHoliday', () => {
  test('should return the formatted object ', () => {
    const holiday = {
      name: 'Armistice de 1918',
      localName: 'Armistice de 1918',
      date: '2024-11-11',
      countryCode: 'FR',
      fixed: true,
      global: true,
      counties: null,
      launchYear: null,
      types: ['National holiday']
    }

    expect(shortenPublicHoliday(holiday)).toEqual({
      name: 'Armistice de 1918',
      localName: 'Armistice de 1918',
      date: '2024-11-11'
    });
  });
});
