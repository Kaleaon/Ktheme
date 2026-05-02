// libs/ktheme-core/src/main/kotlin/io/ktheme/model/JsonStringOrNumberSerializer.kt
//
// Custom serializer so `componentOverrides[].styles` can hold either
// `"text-transform": "uppercase"` or `"padding-inline": 16` without
// forcing every key to be a string.

package io.ktheme.model

import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlinx.serialization.json.JsonDecoder
import kotlinx.serialization.json.JsonEncoder
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.boolean
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.doubleOrNull
import kotlinx.serialization.json.longOrNull

internal object JsonStringOrNumberSerializer : KSerializer<JsonStringOrNumber> {
    override val descriptor: SerialDescriptor =
        PrimitiveSerialDescriptor("JsonStringOrNumber", PrimitiveKind.STRING)

    override fun deserialize(decoder: Decoder): JsonStringOrNumber {
        require(decoder is JsonDecoder) { "JsonStringOrNumber requires JSON" }
        val element = decoder.decodeJsonElement()
        val prim = element as? JsonPrimitive
            ?: error("Expected primitive in style override, got $element")
        val raw = when {
            prim.longOrNull != null -> prim.longOrNull.toString()
            prim.doubleOrNull != null -> prim.doubleOrNull.toString()
            prim.booleanOrNull != null -> prim.boolean.toString()
            else -> prim.contentOrNull ?: ""
        }
        return JsonStringOrNumber(raw)
    }

    override fun serialize(encoder: Encoder, value: JsonStringOrNumber) {
        require(encoder is JsonEncoder) { "JsonStringOrNumber requires JSON" }
        val asLong = value.raw.toLongOrNull()
        val asDouble = value.raw.toDoubleOrNull()
        encoder.encodeJsonElement(
            when {
                asLong != null -> JsonPrimitive(asLong)
                asDouble != null -> JsonPrimitive(asDouble)
                else -> JsonPrimitive(value.raw)
            }
        )
    }
}
