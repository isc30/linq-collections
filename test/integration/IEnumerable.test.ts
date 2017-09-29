import { Enumerable } from "../../src/Enumerables";
import { Test } from "../Test";

export namespace IEnumerableIntegrationTest
{
    interface IPerson
    {
        name: string;
        age: number;
        aliases: string[];
    }

    export function run(): void
    {
        it("Where + Select", whereSelect);
        it("SelectMany + Where", selectManyWhere);
        it("DistinctBy + Select + Max", distinctBySelectMax);
        it("Where + OrderBy + Select", whereOrderBySelect);
    }

    function whereSelect(): void
    {
        const persons = Enumerable.fromSource<IPerson>([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 31, aliases: ["tony"] },
            { name: "Ana", age: 17, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 8, aliases: ["pica", "piedra"] },
        ]);

        const kids = persons
            .where(p => p.age < 18)
            .select(p => `${p.name} (${p.age})`)
            .toArray();

        Test.isArrayEqual(kids, ["Ana (17)", "Pedro (8)"]);
    }

    function selectManyWhere(): void
    {
        const persons = Enumerable.fromSource<IPerson>([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 31, aliases: ["tony"] },
            { name: "Ana", age: 17, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 8, aliases: ["pica", "piedra"] },
        ]);

        const smallAliases = persons
            .selectMany(p => p.aliases)
            .where(a => a.length <= 4)
            .toArray();

        Test.isArrayEqual(smallAliases, ["isc", "tony", "pica"]);
    }

    function distinctBySelectMax(): void
    {
        const persons = Enumerable.fromSource<IPerson>([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 31, aliases: ["tony"] },
            { name: "Ana", age: 31, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 21, aliases: ["pica", "piedra"] },
        ]);

        const max = persons
            .distinct(p => p.age)
            .select(p => p.age + 5)
            .select(a => a + 2)
            .max();

        Test.isEqual(max, 31 + 5 + 2);
    }

    function whereOrderBySelect(): void
    {
        const persons = Enumerable.fromSource<IPerson>([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 38, aliases: ["tony"] },
            { name: "Ana", age: 18, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 9, aliases: ["pica", "piedra"] },
        ]);

        const childToAdult = persons
            .where(p => p.age < 30)
            .orderBy(p => p.age)
            .select(p => p.name)
            .select(n => n + "!")
            .toArray();

        Test.isArrayEqual(childToAdult, ["Pedro!", "Ana!", "Ivan!"]);
    }
}
