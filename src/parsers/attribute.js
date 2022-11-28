export async function parseAttribute(attr, context, ctxName, parentId) {
    const provider = await crs.binding.providers.getAttrProvider(attr.name);

    if (provider == null) return;

    const element = attr.ownerElement;
    if (element["__uuid"] == null) {
        element["__uuid"] = crypto.randomUUID();
    }

    element["__bid"] ||= context.bid;

    await provider.parse(attr, context, ctxName, parentId);
}