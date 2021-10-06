export function sheetResize() {
    Hooks.on("renderparadisPerduActorSheet", async function(app, html, data) {
        console.log(app)
        let sheet = document.getElementById(app.id);
        var ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                const cr = entry.contentRect;

                if (cr.width < 800 || cr.height < 650) {
                    sheet.classList.add("compact")
                } else {
                    sheet.classList.remove("compact");
                }
            };

        });
        ro.observe(sheet);

    })
}