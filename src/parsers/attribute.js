export async function parseAttribute(attr, context, ctxName, parentId) {
    const parts = attr.name.split(".");
    const provider = await crs.binding.providers.get(parts[0], parts[1]);

    if (provider == null) return;

    const element = attr.ownerElement;
    if (element["__uuid"] == null) {
        element["__uuid"] = crypto.randomUUID();
    }

    element["__bid"] = context.bid;

    await provider.parse(attr, context, ctxName, parentId);
}