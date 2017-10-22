import { Test } from "./../Test";
import { Stack } from "./../../src/Collections";

export namespace StackUnitTest
{
    export function run(): void
    {
        describe("Copy", copy);
        describe("Clear", clear);
        describe("Peek", peek);
        describe("Push", push);
        describe("Pop", pop);
    }

    function copy(): void
    {
        it("Type is a Stack", () =>
        {
            const list = new Stack([1, 2, 3]);
            Test.isTrue(list instanceof Stack);
        });

        it("Returns a copy, not a reference", () =>
        {
            const array = [1, 2, 3];
            const stack = new Stack(array);
            const copy = stack.copy();

            Test.isArrayEqual(stack.asArray(), copy.asArray());
            stack.asArray().push(245);
            Test.isArrayNotEqual(stack.asArray(), copy.asArray());
            Test.isArrayEqual(stack.asArray(), [1, 2, 3, 245]);
            Test.isArrayEqual(copy.asArray(), [1, 2, 3]);
        });
    }

    function clear(): void
    {
        it("Does nothing on empty stack", () =>
        {
            const stack = new Stack<number>();
            Test.isArrayEqual(stack.asArray(), []);

            stack.clear();
            Test.isArrayEqual(stack.asArray(), []);

            stack.clear();
            Test.isArrayEqual(stack.asArray(), []);
        });

        it("Stack is cleared", () =>
        {
            const stack = new Stack([1, 2, 3]);
            Test.isArrayEqual(stack.asArray(), [1, 2, 3]);

            stack.clear();
            Test.isArrayEqual(stack.asArray(), []);
        });
    }

    function peek(): void
    {
        it("Returns the element in back of the stack", () =>
        {
            const stack = new Stack([1, 2, 3]);

            let element = stack.peek();
            Test.isEqual(element, 3);
            Test.isArrayEqual(stack.asArray(), [1, 2, 3]);

            stack.pop();

            element = stack.peek();
            Test.isEqual(element, 2);
            Test.isArrayEqual(stack.asArray(), [1, 2]);

            element = stack.peek();
            Test.isEqual(element, 2);
            Test.isArrayEqual(stack.asArray(), [1, 2]);

            stack.pop();

            element = stack.peek();
            Test.isEqual(element, 1);
            Test.isArrayEqual(stack.asArray(), [1]);
        });

        it("Returns undefined in empty stack", () =>
        {
            const stack = new Stack<number>();

            const element = stack.peek();
            Test.isEqual(element, undefined);
            Test.isArrayEqual(stack.asArray(), []);
        });
    }

    function push(): void
    {
        it("Adds element in back of the stack", () =>
        {
            const stack = new Stack<number>();
            stack.push(2); Test.isArrayEqual(stack.asArray(), [2]);
            stack.push(22); Test.isArrayEqual(stack.asArray(), [2, 22]);
            stack.push(1); Test.isArrayEqual(stack.asArray(), [2, 22, 1]);
            stack.push(4); Test.isArrayEqual(stack.asArray(), [2, 22, 1, 4]);
        });
    }

    function pop(): void
    {
        it("Removes and returns the element in back of the stack", () =>
        {
            const stack = new Stack([1, 2, 3]);

            let element = stack.pop();
            Test.isEqual(element, 3);
            Test.isArrayEqual(stack.asArray(), [1, 2]);

            element = stack.pop();
            Test.isEqual(element, 2);
            Test.isArrayEqual(stack.asArray(), [1]);

            element = stack.pop();
            Test.isEqual(element, 1);
            Test.isArrayEqual(stack.asArray(), []);
        });

        it("Returns undefined in empty stack", () =>
        {
            const stack = new Stack<number>();

            const element = stack.pop();
            Test.isEqual(element, undefined);
            Test.isArrayEqual(stack.asArray(), []);
        });
    }
}
