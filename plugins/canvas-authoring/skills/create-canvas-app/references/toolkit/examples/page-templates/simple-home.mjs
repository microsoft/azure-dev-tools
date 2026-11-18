export function createSimpleHomeTemplate(UI) {
    const { createElement: h, ActionCard, SectionHeader } = UI;
    return function SimpleHome({ title, description, tasks, recentTitle = "Recent files", recentContent }) {
        return h("main", { className: "simple-home" },
            h("section", { className: "simple-home-start", "aria-label": title },
                h("div", { className: "simple-home-introduction" },
                    h("h2", null, title),
                    h("p", null, description)),
                h("div", { className: "simple-home-tasks", role: "group", "aria-label": "Tasks" },
                    tasks.map(task => h(ActionCard, {
                        key: task.id, title: task.title, description: task.description,
                        icon: task.icon, compact: true, className: "simple-home-task",
                        disabled: task.disabled, onClick: task.onClick,
                    })))),
            recentContent == null ? null : h("section", { className: "simple-home-recent", "aria-label": recentTitle },
                h(SectionHeader, { title: recentTitle }),
                recentContent));
    };
}
