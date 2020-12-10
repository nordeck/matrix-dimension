import { QueryInterface } from "sequelize";

export default {
    up: (queryInterface: QueryInterface) => {
        return Promise.resolve()
            .then(() => queryInterface.bulkInsert("dimension_widgets", [
                {
                    type: "meeting",
                    name: "Meetings",
                    avatarUrl: "/img/avatars/googlecalendar.png",
                    isEnabled: true,
                    isPublic: true,
                    description: "Create and invite other people to meetings",
                    optionsJson: '{"defaultUrl":"https://meetings.element-widgets.dev.nordeck.systems"}',
                }
            ]));
    },
    down: (queryInterface: QueryInterface) => {
        return Promise.resolve()
            .then(() => queryInterface.bulkDelete("dimension_widgets", {
                type: "meeting",
            }));
    }
}
