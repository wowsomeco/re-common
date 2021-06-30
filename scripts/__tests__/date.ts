import { calculateAge } from '../extensions';

test('calculateAge tests', () => {
  const now = new Date('2021-05-07');

  const dobDate = calculateAge(new Date('2000-10-10'), now);
  expect(dobDate).toBe(20);

  const dob1 = calculateAge('2000-10-10', now);
  expect(dob1).toBe(20);

  const dob2 = calculateAge('2001-05-07', now);
  expect(dob2).toBe(20);

  const dob3 = calculateAge('2001-05-06', now);
  expect(dob3).toBe(19);

  const dob4 = calculateAge('2001-05-01', now);
  expect(dob4).toBe(19);

  const dob5 = calculateAge('1001-10-10', now);
  expect(dob5).toBe(1019);

  const dob6 = calculateAge('1901-10-10', now);
  expect(dob6).toBe(119);
});
