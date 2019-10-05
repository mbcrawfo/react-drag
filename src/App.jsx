/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, List, Row } from "antd";
import React, { useCallback, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

/** @param {number} count */
const generateItems = count => {
    const items = [];

    for (let i = 0; i < count; i += 1) {
        items.push({
            id: `draggable-${i}`,
            text: `Item ${i}`,
        });
    }

    return items;
};

const DragListOfThings = () => {
    const [items, setItems] = useState(generateItems(12));
    const onDragEnd = useCallback(
        result => {
            if (!result.destination) {
                return;
            }

            const updatedItems = [...items];
            const [movedItem] = updatedItems.splice(result.source.index, 1);
            updatedItems.splice(result.destination.index, 0, movedItem);

            setItems(updatedItems);
        },
        [items]
    );

    const listItems = items.map((item, index) => (
        <Draggable key={item.id} draggableId={item.id} index={index}>
            {provided => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <List.Item>{item.text}</List.Item>
                </div>
            )}
        </Draggable>
    ));

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="drop1">
                {provided => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <List bordered>
                            {listItems}
                            {provided.placeholder}
                        </List>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

const App = () => (
    <Row type="flex" justify="space-around">
        <Col span={4}>
            <DragListOfThings />
        </Col>
        <Col span={4}>
            <Button>Test</Button>
        </Col>
    </Row>
);

export default App;
