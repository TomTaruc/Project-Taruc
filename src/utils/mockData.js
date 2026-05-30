// This file now contains only non-user-specific configuration data.
// All user, appointment, and inquiry data has been migrated to the database.

export const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
]

export const appointmentTypes = [
  'Academic Counseling',
  'Career Counseling',
  'Personal Counseling',
  'Group Counseling',
  'Crisis Intervention',
]

export const dailyTips = [
  'Ang pag-asa ay laging nandito. Huwag matakot humingi ng tulong.',
  'Mahalaga ang iyong kalusugan. Alagaan ang iyong sarili.',
  'Huwag mag-atubiling makipag-usap sa isang kaibigan o counselor.',
  'Ang pag-aalaga sa mental health ay hindi kahinaan, ito ay kalakasan.',
  'Magtiwala sa proseso. Ang pagbabago ay nangangailangan ng panahon.',
]

export const barangayData = [
  { name: 'Brgy. Sta. Ana', studentCount: 450, coordinates: { lat: 14.5673, lng: 121.1327 } },
  { name: 'Brgy. Dolores', studentCount: 380, coordinates: { lat: 14.5712, lng: 121.1289 } },
  { name: 'Brgy. San Isidro', studentCount: 320, coordinates: { lat: 14.5645, lng: 121.1356 } },
]