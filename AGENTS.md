# Repository instructions

## Modernization

- Never build in fallbacks, compatibility shims, or parallel legacy/modern execution paths.
- Always modernize affected code, content, and configuration together. Migrate existing data and callers to the current canonical API or format, and remove obsolete variants in the same change.
- Omit absent optional metadata. For required data, fix its source or fail clearly instead of silently substituting a default.
