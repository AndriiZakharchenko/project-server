import {getListOfPublicHolidays } from './services/public-holidays.service';

getListOfPublicHolidays(2024, 'FR').then((response) => {
  console.log(response)
});
