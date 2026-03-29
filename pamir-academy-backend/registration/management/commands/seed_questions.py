"""
Seed exam questions from the frontend sampleQuestions data.
Usage: python manage.py seed_questions
"""
from django.core.management.base import BaseCommand
from registration.models import Subject, ExamQuestion


SAMPLE_QUESTIONS = {
    "English": {
        "beginner": [
            {
                "question_text": "They are walking in the park.",
                "instruction": "What kind of sentence is this?",
                "question_type": "radio",
                "options": ["Simple Sentence", "Compound Sentence", "Complex Sentence", "Compound-Complex Sentence"],
                "correct_answer": "Simple Sentence",
                "explanation": "This is a simple sentence because it contains one independent clause.",
            },
            {
                "question_text": "Being generous in our appreciation and praise can have a profound impact on those around us. When we wholeheartedly approve of someone's efforts or achievements, we not only boost their confidence but also encourage them to continue striving for excellence.",
                "instruction": "What is the main idea of the above text?",
                "question_type": "checkbox",
                "options": ["Praise", "Good will", "Being a great human being at any situation or circumstance", "Supporting human nature"],
                "correct_answers": ["Praise", "Supporting human nature"],
            },
            {
                "question_text": 'The word "cat" has how many letters?',
                "instruction": "Select the correct answer:",
                "question_type": "select",
                "options": ["2", "3", "4", "5"],
                "correct_answer": "3",
            },
            {
                "question_text": "Complete the sentence: I ___ to school every day.",
                "instruction": "Write your answer:",
                "question_type": "text",
                "correct_answer": "go",
            },
        ],
        "intermediate": [
            {
                "question_text": 'Choose the correct form: "If I ___ you, I would study harder."',
                "instruction": "Fill in the blank:",
                "question_type": "radio",
                "options": ["am", "was", "were", "be"],
                "correct_answer": "were",
                "explanation": 'In conditional sentences, "were" is used with "I" in the subjunctive mood.',
            },
        ],
        "advanced": [
            {
                "question_text": "Analyze the rhetorical devices in the following passage...",
                "instruction": "Identify the literary techniques used:",
                "question_type": "checkbox",
                "options": ["Metaphor", "Alliteration", "Personification", "Hyperbole"],
                "correct_answers": ["Metaphor", "Alliteration"],
            },
        ],
    },
    "Math": {
        "beginner": [
            {
                "question_text": "x + 2 = 5",
                "instruction": "What is the value of x?",
                "question_type": "text",
                "correct_answer": "3",
            },
            {
                "question_text": "What is 5 + 3?",
                "instruction": "Select the correct answer:",
                "question_type": "radio",
                "options": ["6", "7", "8", "9"],
                "correct_answer": "8",
            },
        ],
        "intermediate": [
            {
                "question_text": "Solve: 2x + 5 = 15",
                "instruction": "What is the value of x?",
                "question_type": "text",
                "correct_answer": "5",
            },
        ],
        "advanced": [
            {
                "question_text": "Find the derivative of f(x) = x² + 3x",
                "instruction": "Write your answer:",
                "question_type": "text",
                "correct_answer": "2x + 3",
            },
        ],
    },
    "Physics": {
        "beginner": [
            {
                "question_text": "What is the unit of force?",
                "instruction": "Select the correct answer:",
                "question_type": "radio",
                "options": ["Newton", "Joule", "Watt", "Pascal"],
                "correct_answer": "Newton",
            },
        ],
        "intermediate": [
            {
                "question_text": "Calculate the acceleration of an object with mass 10kg and force 50N",
                "instruction": "Write your answer (include unit):",
                "question_type": "text",
                "correct_answer": "5 m/s²",
            },
        ],
        "advanced": [
            {
                "question_text": "Explain the relationship between kinetic energy and momentum.",
                "instruction": "Write a brief explanation:",
                "question_type": "text",
                "correct_answer": "Kinetic energy is proportional to the square of momentum divided by mass.",
            },
        ],
    },
}


class Command(BaseCommand):
    help = "Seed exam questions from sampleQuestions data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear", action="store_true",
            help="Delete all existing questions before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            deleted, _ = ExamQuestion.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} existing questions."))

        created_count = 0
        for subject_name, levels in SAMPLE_QUESTIONS.items():
            subject, _ = Subject.objects.get_or_create(name=subject_name)
            for level, questions in levels.items():
                for order, q_data in enumerate(questions, start=1):
                    _, created = ExamQuestion.objects.get_or_create(
                        subject=subject,
                        level=level,
                        question_text=q_data["question_text"],
                        defaults={
                            "instruction": q_data.get("instruction", ""),
                            "question_type": q_data["question_type"],
                            "options": q_data.get("options", []),
                            "correct_answer": q_data.get("correct_answer", ""),
                            "correct_answers": q_data.get("correct_answers", []),
                            "explanation": q_data.get("explanation", ""),
                            "order": order,
                        },
                    )
                    if created:
                        created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. Created {created_count} new questions across "
            f"{len(SAMPLE_QUESTIONS)} subjects."
        ))
