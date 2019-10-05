/* eslint-disable react/jsx-props-no-spreading */
import { Col, List, Row } from "antd";
import { PropTypes } from "prop-types";
import React, { useCallback, useReducer } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const DraggableList = ({ id, items }) => (
    <Droppable droppableId={id}>
        {dropProvided => (
            <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                <List bordered>
                    {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                            {dragProvided => (
                                <div
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    ref={dragProvided.innerRef}
                                >
                                    <List.Item>{item.text}</List.Item>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {dropProvided.placeholder}
                </List>
            </div>
        )}
    </Droppable>
);

DraggableList.propTypes = {
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.exact({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
        })
    ).isRequired,
};

const initialState = {
    left: Array.from({ length: 12 }).map((_, i) => ({
        id: `left-${i}`,
        text: `Left Item ${i}`,
    })),
    right: Array.from({ length: 12 }).map((_, i) => ({
        id: `right-${i}`,
        text: `Right Item ${i}`,
    })),
};

const App = () => {
    const [items, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "DRAG_LEFT": {
                const left = [...state.left];
                const [moved] = left.splice(action.start, 1);
                left.splice(action.end, 0, moved);
                return {
                    ...state,
                    left,
                };
            }

            case "DRAG_RIGHT": {
                const right = [...state.right];
                const [moved] = right.splice(action.start, 1);
                right.splice(action.end, 0, moved);
                return {
                    ...state,
                    right,
                };
            }

            case "DRAG_LEFT_TO_RIGHT": {
                const left = [...state.left];
                const right = [...state.right];
                const [moved] = left.splice(action.start, 1);
                right.splice(action.end, 0, moved);
                return { left, right };
            }

            case "DRAG_RIGHT_TO_LEFT": {
                const left = [...state.left];
                const right = [...state.right];
                const [moved] = right.splice(action.start, 1);
                left.splice(action.end, 0, moved);
                return { left, right };
            }

            default:
                throw new Error("wtf");
        }
    }, initialState);

    const onDragEnd = useCallback((
        /** @type import("react-beautiful-dnd").DropResult */ result
    ) => {
        if (!result.destination) {
            return;
        }

        const action = {
            type: null,
            start: result.source.index,
            end: result.destination.index,
        };

        if (result.source.droppableId === result.destination.droppableId) {
            action.type = result.source.droppableId === "left" ? "DRAG_LEFT" : "DRAG_RIGHT";
        } else if (result.source.droppableId === "left") {
            action.type = "DRAG_LEFT_TO_RIGHT";
        } else {
            action.type = "DRAG_RIGHT_TO_LEFT";
        }

        dispatch(action);
    }, []);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Row type="flex" justify="space-around">
                <Col span={4}>
                    <DraggableList id="left" items={items.left} />
                </Col>
                <Col span={4}>
                    <DraggableList id="right" items={items.right} />
                </Col>
            </Row>
        </DragDropContext>
    );
};

export default App;
