import { createDb } from './client';
import { env } from './env';
import { todos, user } from './schema';
import { TodoStatus } from './schema/todo';

const db = createDb({ databaseUrl: env.DATABASE_URL });

const seedUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    emailVerified: true,
    image: 'https://avatar.vercel.sh/john',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    emailVerified: true,
    image: 'https://avatar.vercel.sh/jane',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    emailVerified: false,
    image: null,
  },
];

const seedTodos = [
  {
    text: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new API endpoints',
    active: true,
    status: TodoStatus.NOT_STARTED,
    userId: '1',
  },
  {
    text: 'Review pull requests',
    description: 'Review and approve pending PRs from team members',
    active: true,
    status: TodoStatus.IN_PROGRESS,
    userId: '1',
  },
  {
    text: 'Update dependencies',
    description: 'Update all npm packages to latest versions and test',
    active: true,
    status: TodoStatus.COMPLETED,
    userId: '1',
  },
  {
    text: 'Setup CI/CD pipeline',
    description:
      'Configure GitHub Actions for automated testing and deployment',
    active: true,
    status: TodoStatus.NOT_STARTED,
    userId: '2',
  },
  {
    text: 'Design new landing page',
    description: 'Create mockups and wireframes for the new landing page',
    active: true,
    status: TodoStatus.IN_PROGRESS,
    userId: '2',
  },
  {
    text: 'Fix authentication bug',
    description: 'Resolve issue with token expiration handling',
    active: true,
    status: TodoStatus.COMPLETED,
    userId: '2',
  },
  {
    text: 'Optimize database queries',
    description: null,
    active: true,
    status: TodoStatus.NOT_STARTED,
    userId: '3',
  },
  {
    text: 'Write unit tests',
    description: 'Add test coverage for authentication service',
    active: false,
    status: TodoStatus.NOT_STARTED,
    userId: '3',
  },
  {
    text: 'Refactor user service',
    description: 'Break down user service into smaller modules',
    active: true,
    status: TodoStatus.IN_PROGRESS,
    userId: '3',
  },
  {
    text: 'Setup monitoring',
    description: 'Configure application monitoring and alerting',
    active: true,
    status: TodoStatus.NOT_STARTED,
    userId: '1',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    console.log('👤 Inserting users...');
    await db.insert(user).values(seedUsers);
    console.log(`✅ Inserted ${seedUsers.length} users`);

    console.log('📝 Inserting todos...');
    await db.insert(todos).values(seedTodos);
    console.log(`✅ Inserted ${seedTodos.length} todos`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
