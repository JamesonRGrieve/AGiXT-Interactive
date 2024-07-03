export const mockConversation = [
  {
    role: 'USER',
    message: 'What can you tell me about the Mitsubishi 3000GT?',
    timestamp: '2024-07-03T14:16:00Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '[ACTIVITY] Deciding if additional research is required.',
    timestamp: '2024-07-03T14:16:10Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '[ACTIVITY] Searching the web.',
    timestamp: '2024-07-03T14:16:15Z',
    children: [
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Searching for Mitsubishi 3000GT specifications June 21, 2024 02:16 PM.',
        timestamp: '2024-07-03T14:16:20Z',
        children: [],
      },
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Browsing https://www.ultimatespecs.com/car-specs/Mitsubishi/m11135/3000GT.',
        timestamp: '2024-07-03T14:16:25Z',
        children: [],
      },
      {
        role: 'BOT',
        message:
          '[SUBACTIVITY] Browsing https://www.thedrive.com/news/this-mitsubishi-3000gt-lm-edition-is-a-gran-turismo-legend-made-real.',
        timestamp: '2024-07-03T14:16:30Z',
        children: [],
      },
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Browsing https://www.auto-data.net/en/mitsubishi-3000-gt-model-1713.',
        timestamp: '2024-07-03T14:16:35Z',
        children: [],
      },
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Searching for Mitsubishi 3000GT history and performance June 21, 2024 02:16 PM.',
        timestamp: '2024-07-03T14:16:40Z',
        children: [],
      },
      {
        role: 'BOT',
        message: '[SUBACTIVITY] Searching for Mitsubishi 3000GT reviews and ratings June 21, 2024 02:16 PM.',
        timestamp: '2024-07-03T14:16:45Z',
        children: [],
      },
    ],
  },
  {
    role: 'BOT',
    message:
      "The Mitsubishi 3000GT was a sports car produced by Mitsubishi Motors between 1989 and 2000. It was designed as a luxury performance vehicle, with a focus on handling and acceleration. The car featured a twin-turbocharged V6 engine that produced up to 320 horsepower in some models. The 3000GT was available in both coupe and convertible body styles, with the convertible version being known as the Spyder. It had a sleek design with aerodynamic features such as a rear spoiler and air dams. The car also featured four-wheel steering for improved handling and stability at high speeds. One of the unique aspects of the 3000GT was its all-wheel-drive system, which helped provide better traction and performance on various road conditions. It also had an electronically controlled suspension system that could adjust the ride height and damping rate based on driving conditions. The car's interior was designed with comfort and luxury in mind, featuring leather seats, a premium audio system, and advanced climate control systems. The 3000GT was also equipped with various safety features such as anti-lock brakes, electronic stability control, and airbags. Overall, the Mitsubishi 3000GT was a high-performance sports car that offered a combination of luxury, style, and performance. It was well-regarded for its handling, acceleration, and overall driving experience.",
    timestamp: '2024-07-03T14:19:00Z',
    children: [],
  },
  {
    role: 'USER',
    message: 'Did they come in rear-wheel drive?',
    timestamp: '2024-07-03T14:20:00Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '[ACTIVITY] Generating audio response.',
    timestamp: '2024-07-03T14:20:05Z',
    children: [],
  },
  {
    role: 'BOT',
    message: '<audio controls><source src="audio_link.wav" type="audio/wav"></audio>',
    timestamp: '2024-07-03T14:20:10Z',
    children: [],
  },
  {
    role: 'BOT',
    message:
      'No, the Mitsubishi 3000GT did not come with a rear-wheel-drive option. It was primarily available with an all-wheel-drive system, which was one of its distinguishing features.',
    timestamp: '2024-07-03T14:21:00Z',
    children: [],
  },
];
