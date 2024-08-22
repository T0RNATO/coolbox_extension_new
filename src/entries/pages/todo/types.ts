export type Colour = "green" | "red" | "blue" | "yellow" | "purple" | "pink" | "orange" | "cyan";

export type TodoListType = {
    items: TodoItem[],
    title: string,
    id: number,
}

export type TodoItem = {
    content: string,
    completed: boolean,
    colour?: Colour,
}