import { CodeBlock } from "@/components/CodeBlock";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Code } from "lucide-react";

const pythonCodeSimple = `
# Define two numbers
num1 = 10
num2 = 25

# Add them together
sum_result = num1 + num2

# Print the result
print(f"The sum of {num1} and {num2} is: {sum_result}")
`.trim();

const pythonCodeFunction = `
def add_numbers(a, b):
    """This function takes two numbers and returns their sum."""
    return a + b

# Define two numbers
num1 = 10
num2 = 25

# Call the function
sum_result = add_numbers(num1, num2)

# Print the result
print(f"The sum of {num1} and {num2} is: {sum_result}")
`.trim();

export default function PythonAdditionPage() {
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Code className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Python: Adding Two Numbers</CardTitle>
                            <CardDescription>
                                Simple examples of adding two numbers in Python.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2 text-lg">1. Simple Addition (Hardcoded Numbers)</h3>
                        <p className="text-muted-foreground mb-4">This is the most basic way, where you directly define the numbers in your code.</p>
                        <CodeBlock language="python" code={pythonCodeSimple} />
                        <h4 className="font-semibold mt-4 mb-2">Output:</h4>
                        <pre className="bg-muted p-4 rounded-md text-sm"><code>The sum of 10 and 25 is: 35</code></pre>
                    </div>

                     <div>
                        <h3 className="font-semibold mb-2 text-lg">2. Using a Function (Good Practice for Reusability)</h3>
                        <p className="text-muted-foreground mb-4">Encapsulating the logic in a function makes your code reusable and organized.</p>
                        <CodeBlock language="python" code={pythonCodeFunction} />
                        <h4 className="font-semibold mt-4 mb-2">Output:</h4>
                        <pre className="bg-muted p-4 rounded-md text-sm"><code>The sum of 10 and 25 is: 35</code></pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
