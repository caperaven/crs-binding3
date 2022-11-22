export async function parseAttribute(attr, context, ctxName, parentId) {
    const parts = attr.name.split(".");
    const provider = await crs.binding.providers.get(parts[0], parts[1]);

    if (provider == null) return;

    if (attr.ownerElement.dataset.uuid == null) {
        attr.ownerElement.dataset.uuid = crypto.randomUUID();
    }

    await provider.parse(attr, context, ctxName, parentId);
}