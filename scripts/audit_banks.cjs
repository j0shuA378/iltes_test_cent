const fs = require('fs');
const path = require('path');

// Helper to strip TS types from file or parse objects
const readingContent = fs.readFileSync(path.join(__dirname, '../src/data/readingTests.ts'), 'utf-8');
const listeningContent = fs.readFileSync(path.join(__dirname, '../src/data/listeningTests.ts'), 'utf-8');
const writingContent = fs.readFileSync(path.join(__dirname, '../src/data/writingTasks.ts'), 'utf-8');
const speakingContent = fs.readFileSync(path.join(__dirname, '../src/data/speakingTopics.ts'), 'utf-8');

function extractArray(content, varName) {
  const marker = `export const ${varName}:`;
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) return null;
  const equalIdx = content.indexOf('=', startIdx);
  const jsonStr = content.slice(equalIdx + 1).trim().replace(/;$/, '');
  try {
    return eval(jsonStr);
  } catch (e) {
    console.error('Eval error for', varName, e.message);
    return null;
  }
}

const readingTests = extractArray(readingContent, 'READING_TESTS');
const listeningTests = extractArray(listeningContent, 'LISTENING_TESTS');
const writingTasks = extractArray(writingContent, 'WRITING_TASKS');
const speakingTopics = extractArray(speakingContent, 'SPEAKING_TOPICS');

console.log('================ AUDIT REPORT ================');

// 1. Audit Reading Tests
console.log('\n--- 1. READING TESTS AUDIT ---');
console.log(`Total tests: ${readingTests?.length || 0}`);
readingTests?.forEach((t, tIdx) => {
  console.log(`\nTest [${tIdx + 1}] ID: ${t.id} | Bank: ${t.bankCategory} | Passages: ${t.passages.length}`);
  const qIds = new Set();
  const duplicateQIds = [];
  let totalQ = 0;

  t.passages.forEach((p, pIdx) => {
    p.questions.forEach(q => {
      totalQ++;
      if (qIds.has(q.id)) {
        duplicateQIds.push({ passageId: p.id, qId: q.id });
      }
      qIds.add(q.id);

      // Check fields
      if (!q.prompt) console.warn(`  [WARN] Missing prompt in Passage ${p.id}, Q ${q.id}`);
      if (q.correctAnswer === undefined || q.correctAnswer === '') console.warn(`  [WARN] Missing correctAnswer in Passage ${p.id}, Q ${q.id}`);
      if (!q.explanation) console.warn(`  [WARN] Missing explanation in Passage ${p.id}, Q ${q.id}`);
      if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
        console.warn(`  [WARN] MCQ missing options in Passage ${p.id}, Q ${q.id}`);
      }
      if (q.type === 'matching_headings' && (!q.options || q.options.length < 2)) {
        console.warn(`  [WARN] Matching headings missing options in Passage ${p.id}, Q ${q.id}`);
      }
    });
  });

  console.log(`  Total Questions: ${totalQ}`);
  if (duplicateQIds.length > 0) {
    console.error(`  [CRITICAL BUG] Duplicate Question IDs found in test ${t.id}:`, duplicateQIds);
  } else {
    console.log(`  [OK] Question IDs are all unique across passages.`);
  }
});

// 2. Audit Listening Tests
console.log('\n--- 2. LISTENING TESTS AUDIT ---');
console.log(`Total tests: ${listeningTests?.length || 0}`);
listeningTests?.forEach((t, tIdx) => {
  console.log(`\nTest [${tIdx + 1}] ID: ${t.id} | Bank: ${t.bankCategory} | Sections: ${t.sections.length}`);
  const qIds = new Set();
  const duplicateQIds = [];
  let totalQ = 0;

  t.sections.forEach((s) => {
    s.questions.forEach(q => {
      totalQ++;
      if (qIds.has(q.id)) {
        duplicateQIds.push({ sectionNum: s.sectionNumber, qId: q.id });
      }
      qIds.add(q.id);

      if (!q.prompt) console.warn(`  [WARN] Missing prompt in Section ${s.sectionNumber}, Q ${q.id}`);
      if (q.correctAnswer === undefined || q.correctAnswer === '') console.warn(`  [WARN] Missing correctAnswer in Section ${s.sectionNumber}, Q ${q.id}`);
      if (!q.explanation) console.warn(`  [WARN] Missing explanation in Section ${s.sectionNumber}, Q ${q.id}`);
      if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
        console.warn(`  [WARN] MCQ missing options in Section ${s.sectionNumber}, Q ${q.id}`);
      }
    });
  });

  console.log(`  Total Questions: ${totalQ}`);
  if (duplicateQIds.length > 0) {
    console.error(`  [CRITICAL BUG] Duplicate Question IDs found in test ${t.id}:`, duplicateQIds);
  } else {
    console.log(`  [OK] Question IDs are all unique across sections.`);
  }
});

// 3. Audit Writing Tasks
console.log('\n--- 3. WRITING TASKS AUDIT ---');
console.log(`Total tasks: ${writingTasks?.length || 0}`);
const taskIds = new Set();
writingTasks?.forEach(w => {
  if (taskIds.has(w.id)) console.error(`  [CRITICAL BUG] Duplicate writing task ID: ${w.id}`);
  taskIds.add(w.id);
  if (!w.sampleBand9) console.warn(`  [WARN] Task ${w.id} missing sampleBand9`);
  if (!w.sampleAnalysis) console.warn(`  [WARN] Task ${w.id} missing sampleAnalysis`);
  if (!w.keyVocabulary || w.keyVocabulary.length === 0) console.warn(`  [WARN] Task ${w.id} missing keyVocabulary`);
  if (w.type === 'task1' && !w.chartSvg) console.warn(`  [WARN] Task 1 ${w.id} missing chartSvg`);
});

// 4. Audit Speaking Topics
console.log('\n--- 4. SPEAKING TOPICS AUDIT ---');
console.log(`Total topics: ${speakingTopics?.length || 0}`);
const topicIds = new Set();
speakingTopics?.forEach(s => {
  if (topicIds.has(s.id)) console.error(`  [CRITICAL BUG] Duplicate speaking topic ID: ${s.id}`);
  topicIds.add(s.id);
  if (s.part === 2 && (!s.cueCard || !s.cueCard.points || s.cueCard.points.length === 0)) {
    console.warn(`  [WARN] Part 2 topic ${s.id} missing cueCard points`);
  }
  if ((s.part === 1 || s.part === 3) && (!s.questions || s.questions.length === 0)) {
    console.warn(`  [WARN] Part ${s.part} topic ${s.id} missing questions`);
  }
  if (!s.highBandSample) console.warn(`  [WARN] Speaking topic ${s.id} missing highBandSample`);
});

console.log('\n================ AUDIT COMPLETED ================');
