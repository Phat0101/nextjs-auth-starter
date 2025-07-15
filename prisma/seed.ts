import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create 5 users with hashed passwords
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        name: 'Charlie',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana@example.com',
        name: 'Diana',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'edward@example.com',
        name: 'Edward',
        password: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  const userIdMapping = {
    alice: users[0].id,
    bob: users[1].id,
    charlie: users[2].id,
    diana: users[3].id,
    edward: users[4].id,
  };

  // Create sample extraction jobs
  await prisma.job.createMany({
    data: [
      // Alice's jobs
      { 
        title: 'Financial Report Q1 2024', 
        description: 'Extract financial data from quarterly report', 
        fileName: 'financial_report_q1_2024.pdf',
        filePath: '/uploads/financial_report_q1_2024.pdf',
        status: 'COMPLETED',
        result: 'Successfully extracted 150 data points including revenue, expenses, and profit margins.',
        userId: userIdMapping.alice 
      },
      { 
        title: 'Customer Survey Results', 
        description: 'Extract customer feedback and ratings', 
        fileName: 'customer_survey_2024.pdf',
        filePath: '/uploads/customer_survey_2024.pdf',
        status: 'PROCESSING',
        userId: userIdMapping.alice 
      },

      // Bob's jobs
      { 
        title: 'Legal Contract Analysis', 
        description: 'Extract key terms and conditions from contract', 
        fileName: 'contract_analysis.pdf',
        filePath: '/uploads/contract_analysis.pdf',
        status: 'COMPLETED',
        result: 'Extracted contract terms, dates, and obligations. Found 12 key clauses requiring attention.',
        userId: userIdMapping.bob 
      },
      { 
        title: 'Research Paper Data', 
        description: 'Extract research data and citations', 
        fileName: 'research_paper_2024.pdf',
        filePath: '/uploads/research_paper_2024.pdf',
        status: 'FAILED',
        result: 'Failed to process due to poor image quality. Please upload a higher resolution document.',
        userId: userIdMapping.bob 
      },
      { 
        title: 'Technical Documentation', 
        description: 'Extract API specifications and examples', 
        fileName: 'api_documentation.pdf',
        filePath: '/uploads/api_documentation.pdf',
        status: 'PENDING',
        userId: userIdMapping.bob 
      },

      // Charlie's jobs
      { 
        title: 'Invoice Processing', 
        description: 'Extract invoice details and amounts', 
        fileName: 'invoices_batch_1.pdf',
        filePath: '/uploads/invoices_batch_1.pdf',
        status: 'COMPLETED',
        result: 'Processed 25 invoices. Total amount: $45,230.50. All vendor information extracted.',
        userId: userIdMapping.charlie 
      },

      // Diana's jobs
      { 
        title: 'Medical Records Analysis', 
        description: 'Extract patient data and diagnosis information', 
        fileName: 'medical_records_jan2024.pdf',
        filePath: '/uploads/medical_records_jan2024.pdf',
        status: 'PROCESSING',
        userId: userIdMapping.diana 
      },
      { 
        title: 'Insurance Claims Data', 
        description: 'Extract claim details and amounts', 
        fileName: 'insurance_claims_2024.pdf',
        filePath: '/uploads/insurance_claims_2024.pdf',
        status: 'COMPLETED',
        result: 'Successfully processed 45 insurance claims. Total claims value: $125,000.',
        userId: userIdMapping.diana 
      },
      { 
        title: 'Property Assessment Report', 
        description: 'Extract property values and specifications', 
        fileName: 'property_assessment.pdf',
        filePath: '/uploads/property_assessment.pdf',
        status: 'PENDING',
        userId: userIdMapping.diana 
      },

      // Edward's jobs
      { 
        title: 'Academic Transcript Processing', 
        description: 'Extract grades and course information', 
        fileName: 'academic_transcript.pdf',
        filePath: '/uploads/academic_transcript.pdf',
        status: 'COMPLETED',
        result: 'Extracted transcript data for 40 courses. GPA: 3.75. All credit hours calculated.',
        userId: userIdMapping.edward 
      },
      { 
        title: 'Bank Statement Analysis', 
        description: 'Extract transaction history and balances', 
        fileName: 'bank_statement_2024.pdf',
        filePath: '/uploads/bank_statement_2024.pdf',
        status: 'PROCESSING',
        userId: userIdMapping.edward 
      },
      { 
        title: 'Tax Document Processing', 
        description: 'Extract tax information and deductions', 
        fileName: 'tax_documents_2024.pdf',
        filePath: '/uploads/tax_documents_2024.pdf',
        status: 'FAILED',
        result: 'Unable to process due to password protection. Please provide an unlocked document.',
        userId: userIdMapping.edward 
      },
    ],
  });

  console.log('Seeding completed with sample extraction jobs.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
