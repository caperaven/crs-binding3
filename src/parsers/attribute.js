export async function parseAttribute(attr, context, ctxName, parentId) {
    if (attr.ownerElement == null) return;

    const provider = await crs.binding.providers.getAttrProvider(attr.name);

    if (provider == null) return;

    const element = attr.ownerElement;
    crs.binding.utils.markElement(element, context.bid);

    await provider.parse(attr, context, ctxName, parentId);
}